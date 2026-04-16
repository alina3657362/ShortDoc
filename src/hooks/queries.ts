import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteDocument,
  getDocuments,
  getDocumentStatus,
  getDocumentSummary,
  uploadDocument
} from "../api/api.ts";
import type { Document } from '../types/document.ts';

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
      if (query.state.data?.is_ready) return false;
      return 3000;
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};

export const useDocumentSummary = (documentId?: string, isReady?: boolean) => {
  return useQuery({
    queryKey: ['document-summary', documentId],
    queryFn: () => getDocumentSummary(documentId!),
    enabled: !!documentId && isReady === true,
    retry: false,
    staleTime: 10 * 60 * 1000,
  });
};

export const useDocument = (documentId?: string) => {
  const statusQuery = useDocumentStatus(documentId);

  const summaryQuery = useDocumentSummary(
    documentId,
    statusQuery.data?.is_ready
  );

  return {
    status: statusQuery.data,
    summary: summaryQuery.data,

    isReady: statusQuery.data?.is_ready ?? false,
    isLoading: statusQuery.isLoading ||
      (statusQuery.data?.is_ready && summaryQuery.isLoading),
    isFetching: statusQuery.isFetching || summaryQuery.isFetching,
    isError: statusQuery.isError || summaryQuery.isError,
    error: statusQuery.error || summaryQuery.error,
  };
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      if (data?.job?.job_id) {
        queryClient.setQueryData(
          ['document-status', data.document.id],
          data.job
        );
      }
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.removeQueries({ queryKey: ['document-status', documentId] });
      queryClient.removeQueries({ queryKey: ['document-summary', documentId] });
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
