import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveDocument,
  getDocumentsList,
  getDocumentSummary,
  deleteDocument,
} from "../api/api.ts";
import type { Summary } from "../types/summary.ts";
import type { Document } from '../types/document.ts';

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getDocumentsList,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useDocumentSummary = (documentId?: string) => {
  return useQuery({
    queryKey: ['document-summary', documentId],
    queryFn: () => getDocumentSummary(documentId!),
    enabled: !!documentId,
    retry: false,
    staleTime: 10 * 60 * 1000,
  });
};

export const useDocument = (documentId?: string) => {
  const summaryQuery = useDocumentSummary(documentId);

  const isReady = !!summaryQuery.data;

  return {
    summary: summaryQuery.data as Summary | undefined,
    isReady,
    isLoading: summaryQuery.isLoading,
    isFetching: summaryQuery.isFetching,
    isError: summaryQuery.isError,
    error: summaryQuery.error,
  };
};

export const useDocumentFromList = (documentId?: string) => {
  const { data } = useDocuments();

  const document = data?.find((doc: Document) => doc.id === documentId);

  return {
    document,
    isLoading: !data,
  };
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDocument,
    onSuccess: () => {
      // После успешной загрузки обновляем список документов
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.removeQueries({ queryKey: ['document-summary', documentId] });
    },
  });
};
