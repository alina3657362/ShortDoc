from typing import Optional

from pydantic import BaseModel


class DocumentDto(BaseModel):
    id: str
    filename: str
    size_bytes: int
    created_at: str
    updated_at: str


class ProcessingJobDto(BaseModel):
    job_id: str
    document_id: str
    is_ready: bool
    error: Optional[str]


class UploadDocumentResponse(BaseModel):
    document: DocumentDto
    job: ProcessingJobDto


class DocumentListItemDto(BaseModel):
    id: str
    filename: str
    is_ready: bool
    created_at: str


class DocumentListResponse(BaseModel):
    items: list[DocumentListItemDto]


class DocumentStatusResponse(BaseModel):
    job_id: str
    document_id: str
    is_ready: bool
    error: Optional[str]


class SummaryResponse(BaseModel):
    id: str
    document_id: str
    is_ready: bool
    summary: str
    created_at: str


class DeleteDocumentResponse(BaseModel):
    success: bool
    document_id: str


class PdfTextResponse(BaseModel):
    filename: str
    text: str


class SummaryFromFileResponse(BaseModel):
    filename: str
    summary: str
