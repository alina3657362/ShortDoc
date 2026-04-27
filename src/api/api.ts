import { createAPI } from './index.ts';
import type {RegisterRequest} from "../types/register-request.ts";
import type {
  AuthResponse,
  DocumentsListResponse,
  ExtractTextResponse,
  SaveDocumentResponse,
  SummarizeResponse
} from "../types/responses.ts";
import type {LoginRequest} from "../types/login-request.ts";

export const api = createAPI();

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const { data: response } = await api.post<AuthResponse>('/auth/register', data);
  return response;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const { data: response } = await api.post<AuthResponse>('/auth/login', data);
  return response;
};

export const extractText = async (file: File): Promise<ExtractTextResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<ExtractTextResponse>('/documents/extract-text', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const summarizePublic = async (file: File): Promise<SummarizeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<SummarizeResponse>('/documents/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const saveDocument = async (file: File): Promise<SaveDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<SaveDocumentResponse>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const getDocumentsList = async (): Promise<DocumentsListResponse> => {
  const { data } = await api.get<DocumentsListResponse>('/documents');
  return data;
};

class DocumentSummary {
}

export const getDocumentSummary = async (documentId: string): Promise<DocumentSummary> => {
  const { data } = await api.get<DocumentSummary>(`/documents/${documentId}/summary`);
  return data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};
