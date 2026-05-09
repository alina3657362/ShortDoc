from app.core.deps import require_authorization
from app.schemas.common import ErrorResponse
from app.schemas.documents import (
    DeleteDocumentResponse,
    DocumentListResponse,
    PdfTextResponse,
    SummaryFromFileResponse,
    SummaryResponse,
)
from app.services.document_service import document_service
from app.services.llm_service import llm_service
from app.services.pdf_service import pdf_service
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])


def validate_pdf_file(file: UploadFile) -> None:
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


@router.post(
    "",
    response_model=SummaryResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
    },
)
async def upload_document(
        file: UploadFile = File(...),
        current_user: dict = Depends(require_authorization),
):
    validate_pdf_file(file)

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

    return await document_service.create_document_with_summary(
        filename=file.filename,
        content=content,
        user_id=current_user["id"],
        extracted_text=document_text,
        summary=result["summary"],
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
    "/{document_id}/summary",
    response_model=SummaryResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_document_summary(
        document_id: str,
        current_user: dict = Depends(require_authorization),
):
    summary = await document_service.get_summary(
        document_id=document_id,
        user_id=current_user["id"],
    )

    if summary is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
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
async def delete_document(
        document_id: str,
        current_user: dict = Depends(require_authorization),
):
    deleted = await document_service.delete_document(
        document_id=document_id,
        user_id=current_user["id"],
    )

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
    "/extract-text",
    response_model=PdfTextResponse,
    responses={
        400: {"model": ErrorResponse},
    },
)
async def extract_pdf_text(file: UploadFile = File(...)):
    validate_pdf_file(file)

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
    validate_pdf_file(file)

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


@router.get(
    "/{document_id}/text",
    response_model=OriginalTextResponse,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_original_text(
        document_id: str,
        current_user: dict = Depends(require_authorization),
):
    original_text = await document_service.get_original_text(
        document_id=document_id,
        user_id=current_user["id"],
    )

    if original_text is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    return original_text


@router.get(
    "/{document_id}/original",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_original_pdf(
        document_id: str,
        current_user: dict = Depends(require_authorization),
):
    original_pdf = await document_service.get_original_pdf(
        document_id=document_id,
        user_id=current_user["id"],
    )

    if original_pdf is None:
        raise HTTPException(
            status_code=404,
            detail={
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": "Document not found",
                }
            },
        )

    filename = original_pdf["filename"]
    encoded_filename = quote(filename)

    return Response(
        content=original_pdf["content"],
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
        },
    )
