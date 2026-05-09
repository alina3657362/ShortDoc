import uuid

import psycopg2

from app.core.db import get_db_connection


class DocumentService:
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

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO documents (
                        id,
                        user_id,
                        original_filename,
                        size_bytes,
                        content
                    )
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, created_at, updated_at
                    """,
                    (
                        document_id,
                        user_id,
                        filename,
                        size_bytes,
                        psycopg2.Binary(content),
                    ),
                )
                cursor.fetchone()

                cursor.execute(
                    """
                    INSERT INTO document_summaries (
                        id,
                        document_id,
                        extracted_text,
                        summary
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, document_id, summary, created_at
                    """,
                    (
                        summary_id,
                        document_id,
                        extracted_text,
                        summary,
                    ),
                )

                summary_item = cursor.fetchone()
                connection.commit()

        return {
            "id": summary_item["id"],
            "document_id": summary_item["document_id"],
            "is_ready": True,
            "summary": summary_item["summary"],
            "created_at": summary_item["created_at"].isoformat(),
        }

    async def get_documents(self, user_id: str) -> dict:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        id,
                        original_filename AS filename,
                        created_at
                    FROM documents
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    """,
                    (user_id,),
                )

                rows = cursor.fetchall()

        items = []

        for row in rows:
            items.append(
                {
                    "id": row["id"],
                    "filename": row["filename"],
                    "is_ready": True,
                    "created_at": row["created_at"].isoformat(),
                }
            )

        return {"items": items}

    async def get_summary(self, document_id: str, user_id: str) -> dict | None:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        document_summaries.id,
                        document_summaries.document_id,
                        document_summaries.summary,
                        document_summaries.created_at
                    FROM document_summaries
                    JOIN documents ON documents.id = document_summaries.document_id
                    WHERE document_summaries.document_id = %s
                      AND documents.user_id = %s
                    """,
                    (
                        document_id,
                        user_id,
                    ),
                )

                summary_item = cursor.fetchone()

        if summary_item is None:
            return None

        return {
            "id": summary_item["id"],
            "document_id": summary_item["document_id"],
            "is_ready": True,
            "summary": summary_item["summary"],
            "created_at": summary_item["created_at"].isoformat(),
        }

    async def get_original_text(self, document_id: str, user_id: str) -> dict | None:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        documents.id AS document_id,
                        documents.original_filename AS filename,
                        document_summaries.extracted_text
                    FROM documents
                    JOIN document_summaries
                        ON document_summaries.document_id = documents.id
                    WHERE documents.id = %s
                      AND documents.user_id = %s
                    """,
                    (
                        document_id,
                        user_id,
                    ),
                )

                row = cursor.fetchone()

        if row is None:
            return None

        return {
            "document_id": row["document_id"],
            "filename": row["filename"],
            "text": row["extracted_text"],
        }

    async def get_original_pdf(self, document_id: str, user_id: str) -> dict | None:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        original_filename AS filename,
                        content
                    FROM documents
                    WHERE id = %s
                      AND user_id = %s
                    """,
                    (
                        document_id,
                        user_id,
                    ),
                )

                row = cursor.fetchone()

        if row is None:
            return None

        content = row["content"]

        if isinstance(content, memoryview):
            content = content.tobytes()

        return {
            "filename": row["filename"],
            "content": content,
        }

    async def document_exists(self, document_id: str, user_id: str) -> bool:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id
                    FROM documents
                    WHERE id = %s
                      AND user_id = %s
                    """,
                    (
                        document_id,
                        user_id,
                    ),
                )

                document = cursor.fetchone()

        return document is not None

    async def delete_document(self, document_id: str, user_id: str) -> bool:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM documents
                    WHERE id = %s
                      AND user_id = %s
                    RETURNING id
                    """,
                    (
                        document_id,
                        user_id,
                    ),
                )

                deleted = cursor.fetchone()
                connection.commit()

        return deleted is not None


document_service = DocumentService()