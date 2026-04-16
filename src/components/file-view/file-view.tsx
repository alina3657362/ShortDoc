import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './file-view.module.css';
import { useUploadDocument } from "../../hooks/queries.ts";
import { useDocument } from "../../hooks/queries.ts";
import { Link } from "react-router-dom";

interface FileViewProps {
  file: File;
  onRemove: () => void;
}

export function FileView({ file, onRemove }: FileViewProps): React.JSX.Element {
  const navigate = useNavigate();

  const uploadMutation = useUploadDocument();

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const documentId = useMemo(() => {
    return uploadMutation.isSuccess
      ? uploadMutation.data?.document?.id
      : null;
  }, [uploadMutation.isSuccess, uploadMutation.data?.document?.id]);

  const {
    isReady,
    summary,
    isError,
  } = useDocument(documentId || undefined);

  const isPdf = file.type === 'application/pdf';

  useEffect(() => {
    if (isReady && documentId && summary) {
      const timer = setTimeout(() => {
        navigate(`/documents/${documentId}`);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isReady, documentId, summary, navigate]);

  const handleUpload = () => {
    if (!isPdf || !isChecked) return;

    uploadMutation.reset();
    uploadMutation.mutate(file);
  };

  const isUploading = uploadMutation.isPending;
  const isProcessing = !!documentId && !isReady;
  const hasError = uploadMutation.isError ||
    uploadMutation.data?.job?.error ||
    isError;

  const isButtonDisabled = !isPdf || !isChecked || isUploading || isProcessing;

  let buttonContent: React.ReactNode = 'Упростить';

  if (isUploading) {
    buttonContent = (
      <>
        <div className={styles.spinner} />
        Загрузка файла...
      </>
    );
  } else if (isProcessing) {
    buttonContent = (
      <>
        <div className={styles.spinner} />
        Упрощаем документ...
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.file_block} ${!isPdf ? styles.error : ''}`}>
        <div className={styles.file_name}>{file.name}</div>
        <button
          onClick={onRemove}
          className={styles.delete_button}
          disabled={isUploading || isProcessing}
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
        onClick={handleUpload}
        disabled={isButtonDisabled}
        className={`${styles.upload_button} ${!isPdf ? styles.error : ''}`}
      >
        {buttonContent}
      </button>

      <form className={styles.personal_container}>
        <input
          type="checkbox"
          id="personalDataCheckbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={isUploading || isProcessing}
          className={styles.personal_input}
          required
        />
        <label htmlFor="personalDataCheckbox" className={styles.personal_label}>
          Нажимая кнопку «Упростить», я даю своё согласие на{' '}
          <Link to="/privacy" className={styles.personal_link}>
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
