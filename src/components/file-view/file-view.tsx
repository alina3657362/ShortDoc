import React, {useEffect, useState} from 'react';
import styles from './file-view.module.css';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth-context.tsx";
import {useExtractText, useSummarize, useUploadDocument} from "../../hooks/queries.ts";
import {AppRoute} from "../../const.ts";
import type {DocumentPageState} from "../../types/document-page-state.ts";

interface FileViewProps {
  file: File;
  onRemove: () => void;
  onError: (error: Error) => void;
}

export function FileView({ file, onRemove, onError }: FileViewProps): React.JSX.Element {
  const navigate = useNavigate();

  const { isAuth } = useAuth();

  const [isAgreed, setIsAgreed] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);

  const extractTextMutation = useExtractText();
  const uploadDocumentMutation = useUploadDocument();
  const summarizeMutation = useSummarize();

  const isPdf = file.type === 'application/pdf';
  const isLoading =
    extractTextMutation.isPending ||
    summarizeMutation.isPending ||
    uploadDocumentMutation.isPending;

  const isButtonDisabled = isAuth ? !isPdf || isLoading : !isPdf || !isAgreed || isLoading;

  useEffect(() => {
    if (!isLoading) {
      setLoadingDots(1);
      return;
    }

    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingText = `Упрощаем${'.'.repeat(loadingDots)}`;

  const handleSimplify = async () => {
    if (!isPdf || isButtonDisabled) return;

    try {
      const extractResult = await extractTextMutation.mutateAsync(file);
      let summaryResult;
      let documentId: string | undefined;

      if (isAuth) {
        const uploadResult = await uploadDocumentMutation.mutateAsync(file);
        summaryResult = uploadResult;
        documentId = uploadResult.document_id;
      } else {
        summaryResult = await summarizeMutation.mutateAsync(file);
      }

      navigate(documentId ? `/documents/${documentId}` : AppRoute.Summary, {
        replace: true,
        state: {
          filename: extractResult.filename || file.name,
          text: extractResult.text,
          summary: summaryResult.summary,
          documentId,
        } as DocumentPageState,
      });
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error('Ошибка при обработке документа');

      onError(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.file_block} ${!isPdf ? styles.error : ''}`}>
        <div className={styles.file_name}>{file.name}</div>
        <button
          onClick={onRemove}
          className={styles.delete_button}
        >
          <img src="/img/delete.svg" alt="Удалить" width="13" height="14" />
        </button>
      </div>

      {!isPdf && (
        <div className={styles.error_message}>
          Ошибка. Мы поддерживаем не поддерживаем этот формат
        </div>
      )}

      <button
        className={`${styles.upload_button} ${!isPdf ? styles.error : ''}`}
        onClick={handleSimplify}
        disabled={isButtonDisabled}
      >
        {isLoading ? loadingText : 'Упростить'}
      </button>

      { isAuth ? (
        <div></div>
      ) : (
        <form className={styles.personal_container}>
          <input
            type="checkbox"
            id="personalDataCheckbox"
            className={styles.personal_input}
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            required
          />
          <label htmlFor="personalDataCheckbox" className={styles.personal_label}>
            Нажимая кнопку «Упростить», я даю своё согласие на
            <Link to="/public/Правила использования сервиса.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.personal_link}>
              обработку персональных данных
            </Link>
          </label>
        </form>
      )}
    </div>
  );
}
