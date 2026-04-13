import type {ProcessingStatus} from './processing-status.ts';
import type {Document} from './document.ts';

export interface UploadResponse {
  document: Document;
  job: ProcessingStatus;
}
