import type {Document} from "../types/document.ts";

export const mockDocuments: Document[] = [
  {
    id: "doc_001",
    filename: "Договор_поставки_№123.pdf",
    size_bytes: 1245678,
    created_at: "2026-04-15T09:30:00Z",
    updated_at: "2026-04-15T09:35:12Z",
  },
  {
    id: "doc_002",
    filename: "Соглашение_о_конфиденциальности.pdf",
    size_bytes: 845320,
    created_at: "2026-04-16T11:20:00Z",
    updated_at: "2026-04-16T11:45:30Z",
  },
  {
    id: "doc_003",
    filename: "Акт_приема-передачи_оборудования.pdf",
    size_bytes: 673210,
    created_at: "2026-04-16T14:10:00Z",
  },
  {
    id: "doc_004",
    filename: "Дополнительное_соглашение_№45.pdf",
    size_bytes: 932450,
    created_at: "2026-04-17T08:45:00Z",
  },
];
