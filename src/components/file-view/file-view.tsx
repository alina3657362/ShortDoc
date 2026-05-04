import React, {useState} from 'react';
import styles from './file-view.module.css';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth-context.tsx";
import {useExtractText, useSummarize, useUploadDocument} from "../../hooks/queries.ts";
import {AppRoute} from "../../const.ts";
import type {DocumentPageState} from "../../types/document-page-state.ts";

interface FileViewProps {
  file: File;
  onRemove: () => void;
}

export function FileView({ file, onRemove }: FileViewProps): React.JSX.Element {
  const navigate = useNavigate();

  const { isAuth } = useAuth();

  const [isAgreed, setIsAgreed] = useState(false);

  const extractTextMutation = useExtractText();
  const uploadDocumentMutation = useUploadDocument();
  const summarizeMutation = useSummarize();

  const isPdf = file.type === 'application/pdf';
  const isLoading =
    extractTextMutation.isPending ||
    summarizeMutation.isPending ||
    uploadDocumentMutation.isPending;

  const isButtonDisabled = !isPdf || !isAgreed || isLoading;

  const handleSimplify = async () => {
    if (!isPdf || !isAgreed) return;

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
      console.error('Ошибка при обработке документа:', error);
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
        {isLoading ? 'Упрощаем...' : 'Упростить'}
      </button>

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
          <Link to="" className={styles.personal_link}>
            обработку персональных данных
          </Link>
        </label>
      </form>

      {/* Ошибки */}
      {/*(uploadMutation.isError ||
        (uploadMutation.data?.job?.error)) && (
        <div className={styles.error_message}>
          Ошибка при обработке документа. Попробуйте ещё раз.
        </div>
      )*/}
    </div>
  );
}
