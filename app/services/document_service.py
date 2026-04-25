import uuid
from datetime import datetime, timezone

from app.storage.memory import documents_store, summaries_store


class DocumentService:
    @staticmethod
    def utc_now() -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    @staticmethod
    def generate_document_id() -> str:
        return f"doc_{uuid.uuid4().hex[:12]}"

    @staticmethod
    def generate_summary_id() -> str:
        return f"sum_{uuid.uuid4().hex[:12]}"

    async def create_document_with_summary(
            self,
            filename: str,
            content: bytes,
            user_id: str,
            extracted_text: str,
            summary: str,
    ) -> dict:
        size_bytes = len(content)
        document_id = self.generate_document_id()
        summary_id = self.generate_summary_id()
        now = self.utc_now()

        document = {
            "id": document_id,
            "user_id": user_id,
            "filename": filename,
            "size_bytes": size_bytes,
            "created_at": now,
            "updated_at": now,
        }

        summary_item = {
            "id": summary_id,
            "document_id": document_id,
            "is_ready": True,
            "summary": summary,
            "created_at": now,
        }

        documents_store[document_id] = document
        summaries_store[document_id] = summary_item

        return summary_item

    async def get_documents(self, user_id: str) -> dict:
        items = []

        for document_id, document in documents_store.items():
            if document.get("user_id") != user_id:
                continue

            items.append(
                {
                    "id": document["id"],
                    "filename": document["filename"],
                    "is_ready": True,
                    "created_at": document["created_at"],
                }
            )

        items.sort(key=lambda x: x["created_at"], reverse=True)

        return {"items": items}

    async def get_summary(self, document_id: str, user_id: str) -> dict | None:
        document = documents_store.get(document_id)

        if document is None:
            return None

        if document.get("user_id") != user_id:
            return None

        return summaries_store.get(document_id)

    async def document_exists(self, document_id: str, user_id: str) -> bool:
        document = documents_store.get(document_id)

        if document is None:
            return False

        return document.get("user_id") == user_id

    async def delete_document(self, document_id: str, user_id: str) -> bool:
        document = documents_store.get(document_id)

        if document is None:
            return False

        if document.get("user_id") != user_id:
            return False

        documents_store.pop(document_id, None)
        summaries_store.pop(document_id, None)

        return True


document_service = DocumentService()
