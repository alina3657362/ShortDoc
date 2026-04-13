import React, { useState, useEffect } from 'react';
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
  const [documentId, setDocumentId] = useState<string | null>(null);

  const {
    isReady,
    summary
  } = useDocument(documentId || undefined);

  const isPdf = file.type === 'application/pdf';

  useEffect(() => {
    if (uploadMutation.isSuccess && uploadMutation.data?.document?.id) {
      setDocumentId(uploadMutation.data.document.id);
    }
  }, [uploadMutation.isSuccess, uploadMutation.data?.document?.id]);

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

    setDocumentId(null);
    uploadMutation.mutate(file);
  };

  const isUploading = uploadMutation.isPending;
  const isProcessing = !!documentId && !isReady;

  const isButtonDisabled = !isPdf || !isChecked || isUploading || isProcessing;

  let buttonContent: React.ReactNode = 'Упростить';

  if (isUploading) {
    buttonContent = (
      <>
        <div className={styles.spinner} />
        Загрузка...
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
          <img src="/img/delete.svg" alt="delete" width="13" height="14"/>
        </button>
      </div>

      {!isPdf && (
        <div className={styles.error_message}>
          Ошибка. Мы не поддерживаем этот формат документа
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
          onChange={() => setIsChecked(!isChecked)}
          disabled={isUploading || isProcessing}
          className={styles.personal_input}
          required
        />
        <label htmlFor="personalDataCheckbox" className={styles.personal_label}>
          Нажимая кнопку «Упростить», я даю своё согласие на{' '}
          <Link to="" className={styles.personal_link}>обработку персональных данных</Link>
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
