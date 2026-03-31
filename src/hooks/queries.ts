import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {deleteDocument, getDocumentStatus, getDocumentSummary, uploadDocument} from "../api/api.ts";

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
