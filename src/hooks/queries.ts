import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {deleteDocument, getDocuments, getDocumentStatus, getDocumentSummary, uploadDocument} from "../api/api.ts";
import type {Document} from '../types/document.ts';

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useDocumentStatus = (documentId?: string) => {
  return useQuery({
    queryKey: ['document-status', documentId],
    queryFn: () => getDocumentStatus(documentId!),
    enabled: !!documentId,

    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.is_ready ? false : 4000;
    },

    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};

export const useDocumentSummary = (documentId?: string) => {
  return useQuery({
    queryKey: ['document-summary', documentId],
    queryFn: () => getDocumentSummary(documentId!),
    enabled: !!documentId,
  });
};

export const useDocument = (documentId?: string) => {
  const statusQuery = useDocumentStatus(documentId);
  const summaryQuery = useDocumentSummary(documentId);

  return {
    status: statusQuery.data,
    summary: summaryQuery.data,

    isLoading: statusQuery.isLoading || summaryQuery.isLoading,
    isReady: statusQuery.data?.is_ready ?? false,
    isError: statusQuery.isError || summaryQuery.isError,
  };
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDocumentFromList = (documentId?: string) => {
  const { data } = useDocuments();

  const document = data?.items.find((doc: Document) => doc.id === documentId);

  return {
    document,
    isLoading: !data,
  };
};
