import type {User} from "./user.ts";
import type {Document} from "./document.ts";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
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

export interface DocumentsListResponse {
  items: Document[];
}

export interface DocumentTextResponse {
  document_id: string;
  filename: string;
  text: string;
}

