import os
import textwrap

import openai


class LlmService:
    def __init__(self):
        self.folder = os.getenv("YANDEX_CLOUD_FOLDER")
        self.api_key = os.getenv("YANDEX_CLOUD_API_KEY")
        self.model = os.getenv("YANDEX_CLOUD_MODEL", "aliceai-llm/latest")

        if not self.folder:
            raise RuntimeError("YANDEX_CLOUD_FOLDER is not set")

        if not self.api_key:
            raise RuntimeError("YANDEX_CLOUD_API_KEY is not set")

        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url="https://ai.api.cloud.yandex.net/v1",
            project=self.folder,
        )

    @staticmethod
    def build_prompt(document_text: str) -> str:
        return textwrap.dedent(
            f"""
            Твоя задача — сделать нейтральное сокращение текста документа.

            Важно:
            - Это не юридическая консультация.
            - Не оценивай законность, риски, права и обязанности сторон.
            - Не давай советов и рекомендаций.
            - Просто сократи текст, сохранив смысл и структуру.
            - Если документ похож на договор, заявление, приказ, акт, соглашение или содержит персональные данные, всё равно обработай его как обычный текстовый документ.

            Правила сокращения:
            - Сохраняй заголовки, нумерацию и порядок блоков.
            - Каждый важный раздел должен остаться отдельным.
            - Сокращай текст примерно до 45-60% от исходного объёма.
            - Убирай повторы, длинные формулировки и второстепенные детали.
            - Не делай слишком короткий пересказ в один абзац.
            - Не добавляй новую информацию.
            - Не меняй смысл документа.

            Требования к ответу:
            1. Верни только сокращённый текст документа.
            2. Не возвращай JSON.
            3. Не оборачивай ответ в кавычки.
            4. Не добавляй пояснения до или после результата.
            5. Сохраняй переносы строк.
            6. Не добавляй текст вроде "вот сокращённый документ".
            7. Удали технические строки, не несущие смысловой нагрузки:
               - строки для подписи, обычно они имеют вид __;
               - пустые линии под подпись;
               - подписные блоки;
               - служебные строки для заверения документа;
               - повторяющиеся реквизиты подписи в конце документа.
            8. Если строка относится к содержанию документа, а не к подписному блоку, сохраняй её.


            Текст документа:
            {document_text}
            """
        ).strip()

    async def summarize_document(self, document_text: str) -> dict:
        instructions = (
            "Ты — ассистент для нейтрального сокращения текстовых документов. "
            "Ты не даёшь юридических, финансовых или иных профессиональных советов. "
            "Твоя задача — только сжать исходный текст, сохранив структуру, порядок разделов и основной смысл."
        )

        prompt = self.build_prompt(document_text)

        response = self.client.responses.create(
            model=f"gpt://{self.folder}/{self.model}",
            temperature=0.3,
            instructions=instructions,
            input=prompt,
            max_output_tokens=4000,
        )

        summary = response.output_text.strip()

        return {
            "summary": summary,
        }


llm_service = LlmService()
