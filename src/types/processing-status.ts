export interface ProcessingStatus {
  job_id: string;
  document_id: string;
  is_ready: boolean;
  error: string | null;
}
