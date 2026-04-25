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
            Правила:
            - НЕ пиши краткий пересказ в один абзац
            - СОХРАНИ заголовки, нумерацию и порядок блоков
            - Каждый раздел должен остаться отдельным
            - Внутри разделов сокращай текст, но не теряй смысл
            - Не добавляй новую информацию

            Верни только сокращённый текст документа.
            Не возвращай JSON.
            Не оборачивай ответ в кавычки.
            Не добавляй пояснения до или после результата.

            Требования:
            1. Сохраняй переносы строк.
            2. Не добавляй лишний текст вроде "вот твоё summary".
            3. Удали технические строки, не несущие смысловой нагрузки:
               - строки для подписи, обычно они имеют вид __;
               - пустые линии под подпись;
               - "Подпись", "Работник", "Работодатель" в виде подписных блоков;
               - служебные строки для заверения документа;
               - повторяющиеся реквизиты подписи в конце документа.
            4. Если строка относится к содержанию документа, а не к подписному блоку, сохраняй её.

            Текст документа:
            {document_text}
            """
        ).strip()

    async def summarize_document(self, document_text: str) -> dict:
        instructions = (
            "Ты — ассистент по работе с юридическими документами. "
            "Твоя задача — сократить текст, сохранив структуру документа."
        )

        prompt = self.build_prompt(document_text)

        response = self.client.responses.create(
            model=f"gpt://{self.folder}/{self.model}",
            temperature=0.3,
            instructions=instructions,
            input=prompt,
            max_output_tokens=5000,
        )

        summary = response.output_text.strip()

        return {
            "summary": summary,
        }


llm_service = LlmService()
