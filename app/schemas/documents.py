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


class PartyDto(BaseModel):
    name: str
    role: str


class ImportantDateDto(BaseModel):
    label: str
    value: str


class SummaryResponse(BaseModel):
    id: str
    document_id: str
    is_ready: bool
    summary: str
    parties: list[PartyDto]
    important_dates: list[ImportantDateDto]
    created_at: str


class DeleteDocumentResponse(BaseModel):
    success: bool
    document_id: str