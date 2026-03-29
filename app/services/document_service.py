from datetime import datetime, timezone
import uuid

from app.storage.memory import documents_store, jobs_store, summaries_store


class DocumentService:
    @staticmethod
    def utc_now() -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    @staticmethod
    def generate_document_id() -> str:
        return f"doc_{uuid.uuid4().hex[:12]}"

    @staticmethod
    def generate_job_id() -> str:
        return f"job_{uuid.uuid4().hex[:12]}"

    @staticmethod
    def generate_summary_id() -> str:
        return f"sum_{uuid.uuid4().hex[:12]}"

    async def upload_document(self, filename: str, content: bytes) -> dict:
        size_bytes = len(content)
        document_id = self.generate_document_id()
        job_id = self.generate_job_id()
        now = self.utc_now()

        document = {
            "id": document_id,
            "filename": filename,
            "size_bytes": size_bytes,
            "status": "processing",
            "created_at": now,
            "updated_at": now,
        }

        job = {
            "job_id": job_id,
            "document_id": document_id,
            "is_ready": False,
            "error": None,
        }

        documents_store[document_id] = document
        jobs_store[document_id] = job

        return {
            "document": {
                "id": document["id"],
                "filename": document["filename"],
                "size_bytes": document["size_bytes"],
                "created_at": document["created_at"],
                "updated_at": document["updated_at"],
            },
            "job": job,
        }

    async def get_documents(self) -> dict:
        items = []

        for document_id, document in documents_store.items():
            job = jobs_store.get(document_id)

            items.append(
                {
                    "id": document["id"],
                    "filename": document["filename"],
                    "is_ready": job["is_ready"] if job else False,
                    "created_at": document["created_at"],
                }
            )

        items.sort(key=lambda x: x["created_at"], reverse=True)

        return {"items": items}

    async def get_status(self, document_id: str) -> dict | None:
        return jobs_store.get(document_id)

    async def get_summary(self, document_id: str) -> dict | None:
        return summaries_store.get(document_id)

    async def document_exists(self, document_id: str) -> bool:
        return document_id in documents_store

    async def delete_document(self, document_id: str) -> bool:
        if document_id not in documents_store:
            return False

        documents_store.pop(document_id, None)
        jobs_store.pop(document_id, None)
        summaries_store.pop(document_id, None)

        return True

    async def mark_ready(self, document_id: str) -> bool:
        document = documents_store.get(document_id)
        job = jobs_store.get(document_id)

        if document is None or job is None:
            return False

        now = self.utc_now()

        document["status"] = "ready"
        document["updated_at"] = now
        job["is_ready"] = True
        job["error"] = None

        summaries_store[document_id] = {
            "id": self.generate_summary_id(),
            "document_id": document_id,
            "is_ready": True,
            "summary": "Это тестовое summary для юридического документа.",
            "parties": [
                {
                    "name": "ООО Ромашка",
                    "role": "Заказчик",
                },
                {
                    "name": "ООО Вектор",
                    "role": "Исполнитель",
                },
            ],
            "important_dates": [
                {
                    "label": "Дата подписания",
                    "value": "2026-03-01",
                },
                {
                    "label": "Дата окончания",
                    "value": "2027-03-01",
                },
            ],
            "created_at": now,
        }

        return True


document_service = DocumentService()