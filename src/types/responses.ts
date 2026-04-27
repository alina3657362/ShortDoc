import type {Summary} from "./summary.ts";
import type {User} from "./user.ts";
import type {Document} from "./document.ts";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ExtractTextResponse {
  filename: string;
  text: string;
}

export interface SummarizeResponse {
  filename: string;
  summary: string;
}

export type DocumentsListResponse = Document[];
export type SaveDocumentResponse = Summary;
