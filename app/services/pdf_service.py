from io import BytesIO

from pypdf import PdfReader


class PdfService:
    async def extract_text(self, content: bytes) -> str:
        reader = PdfReader(BytesIO(content))

        pages_text = []
        for page in reader.pages:
            text = page.extract_text() or ""
            text = text.strip()
            if text:
                pages_text.append(text)

        return "\n\n".join(pages_text)


pdf_service = PdfService()