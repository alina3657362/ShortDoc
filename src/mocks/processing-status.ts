import type {ProcessingStatus} from "../types/processing-status.ts";

export const mockProcessingJobs: Record<string, ProcessingStatus> = {
  "doc_001": {
    job_id: "job_001",
    document_id: "doc_001",
    is_ready: true,
    error: null,
  },
  "doc_002": {
    job_id: "job_002",
    document_id: "doc_002",
    is_ready: false,
    error: null,
  },
  "doc_003": {
    job_id: "job_003",
    document_id: "doc_003",
    is_ready: false,
    error: null,
  },
  "doc_004": {
    job_id: "job_004",
    document_id: "doc_004",
    is_ready: false,
    error: "Превышено время обработки. Файл поврежден или слишком большой.",
  },
};
