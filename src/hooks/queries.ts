import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  register,
  login,
  extractText,
  getDocumentsList,
  getDocumentSummary,
  deleteDocument, summarize, uploadDocument, getDocumentOriginal, getDocumentText,
} from "../api/api.ts";
import type {RegisterRequest} from "../types/register-request.ts";
import type {LoginRequest} from "../types/login-request.ts";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
};

export const useExtractText = () => {
  return useMutation({
    mutationFn: (file: File) => extractText(file),
  });
};

export const useSummarize = () => {
  return useMutation({
    mutationFn: (file: File) => summarize(file),
  });
};

// hooks/queries.ts
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
        exact: true
      });

      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: ['documents'],
          exact: true
        });
      }, 300);
    },
  });
};

export const useDocumentsList = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getDocumentsList,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useDocumentById = (documentId: string) => {
  const { data: documents, isLoading, error } = useDocumentsList();

  const document = documents?.items.find((doc) => doc.id === documentId);

  return {
    document,
    isLoading,
    error,
  };
};

export const useDocumentSummary = (documentId: string) => {
  return useQuery({
    queryKey: ['document', documentId, 'summary'],
    queryFn: () => getDocumentSummary(documentId),
    enabled: !!documentId,
  });
};

export const useDocumentText = (documentId: string) => useQuery({
  queryKey: ['document', documentId, 'text'],
  queryFn: () => getDocumentText(documentId),
  enabled: !!documentId,
});

export const useDocumentOriginal = (documentId: string) => useQuery({
  queryKey: ['document', documentId, 'original'],
  queryFn: () => getDocumentOriginal(documentId),
  enabled: !!documentId,
  // blob не кэшируется по умолчанию хорошо, можно отключить кэш если нужно
  staleTime: 0,
});

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
