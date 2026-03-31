import type {ProcessingStatus} from './processing-status.ts';

export interface UploadResponse {
  document: Document;
  job: ProcessingStatus;
}
