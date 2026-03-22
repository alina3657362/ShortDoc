# ShortDoc

## 1. Назначение

Сервис принимает юридический документ от пользователя, обрабатывает его и возвращает структурированное summary.

API предназначен для взаимодействия между frontend и backend в формате REST.

---

## 2. Общая схема работы

Основной пользовательский сценарий:

1. Пользователь загружает юридический документ.
2. Backend сохраняет файл, создает `document_id` и запускает обработку.
3. Frontend периодически запрашивает статус обработки.
4. После завершения обработки frontend получает summary документа.
5. При необходимости пользователь может перегенерировать summary с другими параметрами.

---

## 3. Базовая информация

**Base URL**

```text
/api/v1
```

**Аутентификация**

```text
Authorization: Bearer <TOKEN>
```

**Форматы данных**

- `application/json` — для обычных запросов и ответов
- `multipart/form-data` — для загрузки файла

**Поддерживаемые форматы файлов**

- PDF

---

## 4. Базовые термины

| Поле / термин | Что означает |
|---|---|
| `filename` | Имя файла, которое было у документа при загрузке, например `contract.pdf` |
| `size_bytes` | Размер файла в байтах |
| `document_id` | Уникальный идентификатор документа в системе |
| `job_id` | Уникальный идентификатор задачи на обработку документа |
| `is_ready` | Булевый флаг: `true`, если результат уже готов, иначе `false` |
| `summary` | Краткое описание документа |
| `parties` | Стороны документа, например заказчик и исполнитель |
| `important_dates` | Важные даты, найденные в документе |
| `created_at` | Дата и время создания записи |
| `updated_at` | Дата и время последнего обновления записи |

---

## 5. Основные сущности

### 5.1 Document

```json
{
  "id": "doc_123",
  "filename": "contract.pdf",
  "size_bytes": 245678,
  "status": "processing",
  "created_at": "2026-03-17T10:00:00Z",
  "updated_at": "2026-03-17T10:00:10Z"
}
```

#### Описание полей `Document`

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Уникальный идентификатор документа |
| `filename` | string | Исходное имя загруженного файла |
| `size_bytes` | integer | Размер файла в байтах |
| `created_at` | string (ISO datetime) | Когда документ был создан в системе |
| `updated_at` | string (ISO datetime) | Когда документ последний раз обновлялся |

### 5.2 Processing Job

```json
{
  "job_id": "job_123",
  "document_id": "doc_123",
  "is_ready": false,
  "error": null
}
```

#### Описание полей `Processing Job`

| Поле | Тип | Описание |
|---|---|---|
| `job_id` | string | Уникальный идентификатор задачи обработки |
| `document_id` | string | Идентификатор документа, к которому относится задача |
| `is_ready` | boolean | `true`, если обработка завершена и результат готов |
| `error` | string \| null | Текст ошибки, если обработка завершилась неуспешно |

### 5.3 Summary

```json
{
  "id": "sum_123",
  "document_id": "doc_123",
  "is_ready": true,
  "summary": "Документ регулирует ...",
  "parties": [
    {
      "name": "ООО Ромашка",
      "role": "Заказчик"
    }
  ],
  "important_dates": [
    {
      "label": "Дата окончания",
      "value": "2027-03-01"
    }
  ],
  "created_at": "2026-03-17T10:01:00Z"
}
```

#### Описание полей `Summary`

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Уникальный идентификатор summary |
| `document_id` | string | Идентификатор документа |
| `is_ready` | bool | Статус summary|
| `summary` | string | summary документа |
| `parties` | array[object] | Список сторон документа |
| `important_dates` | array[object] | Список важных дат |
| `created_at` | string (ISO datetime) | Когда summary было создано |

#### Структура объекта `parties`

| Поле | Тип | Описание |
|---|---|---|
| `name` | string | Название стороны, например `ООО Ромашка` |
| `role` | string | Роль стороны в документе, например `Заказчик` |

#### Структура объекта `important_dates`

| Поле | Тип | Описание |
|---|---|---|
| `label` | string | Название даты, например `Дата подписания` |
| `value` | string | Значение даты в формате `YYYY-MM-DD` |

---

## 6. Статусы обработки

### 6.1 Статусы документа / задачи

| Значение | Описание |
|---|---|
| `queued` | Документ поставлен в очередь |
| `processing` | Документ обрабатывается |
| `ready` | Summary готов |
| `failed` | Во время обработки произошла ошибка |

---

## 7. API методы

## 7.1 Загрузка документа

### `POST /api/v1/documents`

Загружает файл документа и создает задачу на обработку.

### Request

**Content-Type:** `multipart/form-data`

### Form fields

| Поле | Тип | Обязательное | Описание |
|---|---|---:|---|
| `file` | file | да | Файл документа |

### Пример запроса

```bash
curl -X POST "https://example.com/api/v1/documents" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/json" \
  -F "file=@./contract.pdf"
```

### Response `201 Created`

```json
{
  "document": {
    "id": "doc_123",
    "filename": "contract.pdf",
      "size_bytes": 245678,
    "created_at": "2026-03-17T10:00:00Z",
    "updated_at": "2026-03-17T10:00:00Z"
  },
  "job": {
    "job_id": "job_123",
    "document_id": "doc_123",
    "is_ready": false,
    "error": null
  }
}
```

#### Описание полей ответа

**Поле `document`**

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Идентификатор документа |
| `filename` | string | Имя загруженного файла |
| `size_bytes` | integer | Размер файла в байтах |
| `created_at` | string (ISO datetime) | Дата создания |
| `updated_at` | string (ISO datetime) | Дата последнего обновления |

**Поле `job`**

| Поле | Тип | Описание |
|---|---|---|
| `job_id` | string | Идентификатор задачи |
| `document_id` | string | Идентификатор документа |
| `is_ready` | boolean | `true`, если результат уже готов |
| `error` | string \| null | Ошибка, если она есть |

---

## 7.2 Получить список документов

### `GET /api/v1/documents`

Возвращает список документов пользователя.

### Пример запроса

```bash
curl -X GET "https://example.com/api/v1/documents" \
  -H "Authorization: Bearer <TOKEN>"
```

### Response `200 OK`

```json
{
  "items": [
    {
      "id": "doc_123",
      "filename": "contract.pdf",
      "created_at": "2026-03-17T10:00:00Z"
    },
    {
      "id": "doc_124",
      "filename": "nda.docx",
      "created_at": "2026-03-17T10:05:00Z"
    }
  ]
}
```

#### Описание полей ответа

**Поле `items`** — массив документов.

Структура одного элемента `items`:

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Идентификатор документа |
| `filename` | string | Имя файла |
| `is_ready` | bool | Статус документа |
| `created_at` | string (ISO datetime) | Дата загрузки документа |

---

## 7.3 Получить статус обработки

### `GET /api/v1/documents/{document_id}/status`

Возвращает текущий статус обработки документа.

### Пример запроса

```bash
curl -X GET "https://example.com/api/v1/documents/doc_123/status" \
  -H "Authorization: Bearer <TOKEN>"
```

### Response `200 OK`

```json
{
  "job_id": "job_123",
  "document_id": "doc_123",
  "is_ready": false,
  "error": null
}
```

#### Описание полей ответа

| Поле | Тип | Описание |
|---|---|---|
| `job_id` | string | Идентификатор задачи обработки |
| `document_id` | string | Идентификатор документа |
| `is_ready` | boolean | `true`, если summary уже можно запрашивать |
| `error` | string \| null | Ошибка, если есть |

---

## 7.4 Получить summary документа

### `GET /api/v1/documents/{document_id}/summary`

Возвращает готовый summary документа.

### Пример запроса

```bash
curl -X GET "https://example.com/api/v1/documents/doc_123/summary" \
  -H "Authorization: Bearer <TOKEN>"
```

### Response `200 OK`

```json
{
  "id": "sum_123",
  "document_id": "doc_123",
  "is_ready": true,
  "summary": "Это договор поставки между ООО Ромашка и ООО Вектор.",
  "parties": [
    {
      "name": "ООО Ромашка",
      "role": "Покупатель"
    },
    {
      "name": "ООО Вектор",
      "role": "Поставщик"
    }
  ],
  "important_dates": [
    {
      "label": "Дата подписания",
      "value": "2026-03-01"
    },
    {
      "label": "Дата окончания",
      "value": "2027-03-01"
    }
  ],
  "created_at": "2026-03-17T10:01:00Z"
}
```

#### Описание полей ответа

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Идентификатор summary |
| `document_id` | string | Идентификатор документа |
| `summary` | string | Подробное summary |
| `parties` | array[object] | Стороны документа |
| `important_dates` | array[object] | Важные даты |
| `created_at` | string (ISO datetime) | Дата создания summary |

**Структура элемента `parties`**

| Поле | Тип | Описание |
|---|---|---|
| `name` | string | Название стороны |
| `role` | string | Роль стороны |

**Структура элемента `important_dates`**

| Поле | Тип | Описание |
|---|---|---|
| `label` | string | Название даты |
| `value` | string | Значение даты |

### Ошибка, если summary еще не готов

**Response `409 Conflict`**

```json
{
  "error": {
    "code": "SUMMARY_NOT_READY",
    "message": "Summary is not ready yet"
  }
}
```

---

## 7.8 Удалить документ

### `DELETE /api/v1/documents/{document_id}`

Удаляет документ и связанные с ним результаты обработки.

### Response `200 OK`

```json
{
  "success": true,
  "document_id": "doc_123"
}
```

#### Описание полей ответа

| Поле | Тип | Описание |
|---|---|---|
| `success` | boolean | Флаг успешного удаления |
| `document_id` | string | Идентификатор удаленного документа |

---
