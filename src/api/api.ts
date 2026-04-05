import {createAPI} from './index.ts';
import type {UploadResponse} from '../types/upload-response.ts';
import type {ProcessingStatus} from '../types/processing-status.ts';
import type {Summary} from '../types/summary.ts';
import type { DocumentsListResponse } from '../types/documents-list-response.ts';

export const api = createAPI();

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<UploadResponse>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const getDocuments = async (): Promise<DocumentsListResponse> => {
  const { data } = await api.get<DocumentsListResponse>('/documents');
  return data;
};

export const getDocumentStatus = async (documentId: string): Promise<ProcessingStatus> => {
  const { data } = await api.get<ProcessingStatus>(`/documents/${documentId}/status`);
  return data;
};

export const getDocumentSummary = async (documentId: string): Promise<Summary> => {
  const { data } = await api.get<Summary>(`/documents/${documentId}/summary`);
  return data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};


