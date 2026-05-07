import { createAPI } from './index.ts';
import type {RegisterRequest} from "../types/register-request.ts";
import type {
  DocumentsListResponse,
  ExtractTextResponse, LoginResponse, RegisterResponse,
  SummarizeResponse,
} from "../types/responses.ts";
import type {LoginRequest} from "../types/login-request.ts";
import type {Summary} from "../types/summary.ts";

export const api = createAPI();

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const { data: response } = await api.post<RegisterResponse>('/auth/register', data);
  return response;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const { data: response } = await api.post<LoginResponse>('/auth/login', data);
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

export const summarize = async (file: File): Promise<SummarizeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<SummarizeResponse>('/documents/summarize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const uploadDocument = async (file: File): Promise<Summary> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<Summary>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const getDocumentsList = async (): Promise<DocumentsListResponse> => {
  const { data } = await api.get<DocumentsListResponse>('/documents');
  return data;
};

export const getDocumentSummary = async (documentId: string): Promise<Summary> => {
  const { data } = await api.get<Summary>(`/documents/${documentId}/summary`);
  return data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};
