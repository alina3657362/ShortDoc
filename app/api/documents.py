from app.core.deps import require_authorization
from app.schemas.common import ErrorResponse
from app.schemas.documents import (
    DeleteDocumentResponse,
    DocumentListResponse,
    DocumentStatusResponse,
    SummaryResponse,
    UploadDocumentResponse,
    PdfTextResponse,
    SummaryFromFileResponse,
)
from app.services.document_service import document_service
from app.services.llm_service import llm_service
from app.services.pdf_service import pdf_service
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])


@router.post(
    "",
    response_model=UploadDocumentResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse},
    },
)
async def upload_document(
        file: UploadFile = File(...),
        current_user: dict = Depends(require_authorization),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "INVALID_FILE",
                    "message": "Filename is required",
                }
            },
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "UNSUPPORTED_FILE_TYPE",
                    "message": "Only PDF files are supported",
                }
            },
        )

    content = await file.read()

    return await document_service.upload_document(
        filename=file.filename,
        content=content,
        user_id=current_user["id"],
    )


@router.get(
    "",
    response_model=DocumentListResponse,
    responses={
        401: {"model": ErrorResponse},
    },
)
async def get_documents(
        current_user: dict = Depends(require_authorization),
):
    return await document_service.get_documents(user_id=current_user["id"])


@router.get(
    "/{document_id}/status",
    response_model=DocumentStatusResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_document_status(document_id: str, ):
    job = await document_service.get_status(document_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    return job


@router.get(
    "/{document_id}/summary",
    response_model=SummaryResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
    },
)
async def get_document_summary(document_id: str, ):
    exists = await document_service.document_exists(document_id)
    if not exists:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    summary = await document_service.get_summary(document_id)
    if summary is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "SUMMARY_NOT_READY",
                    "message": "Summary is not ready yet",
                }
            },
        )

    return summary


@router.delete(
    "/{document_id}",
    response_model=DeleteDocumentResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def delete_document(document_id: str, ):
    deleted = await document_service.delete_document(document_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    return {
        "success": True,
        "document_id": document_id,
    }


@router.post(
    "/{document_id}/mock-ready",
    responses={
        404: {"model": ErrorResponse},
    },
)
async def mock_ready(document_id: str):
    marked = await document_service.mark_ready(document_id)

    if not marked:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    return {"success": True}


@router.post(
    "/extract-text",
    response_model=PdfTextResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
    },
)
async def extract_pdf_text(file: UploadFile = File(...), ):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "INVALID_FILE",
                    "message": "Filename is required",
                }
            },
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "UNSUPPORTED_FILE_TYPE",
                    "message": "Only PDF files are supported",
                }
            },
        )

    content = await file.read()
    text = await pdf_service.extract_text(content)

    return {
        "filename": file.filename,
        "text": text,
    }


@router.post(
    "/summarize",
    response_model=SummaryFromFileResponse,
    responses={
        400: {"model": ErrorResponse},
    },
)
async def summarize_pdf(
        file: UploadFile = File(...),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "INVALID_FILE",
                    "message": "Filename is required",
                }
            },
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "UNSUPPORTED_FILE_TYPE",
                    "message": "Only PDF files are supported",
                }
            },
        )

    content = await file.read()
    document_text = await pdf_service.extract_text(content)

    if not document_text.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "EMPTY_PDF_TEXT",
                    "message": "Could not extract text from PDF",
                }
            },
        )

    result = await llm_service.summarize_document(document_text)

    return {
        "filename": file.filename,
        "summary": result["summary"],
    }
