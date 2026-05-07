import React, {useEffect, useState} from "react";
import type {Document} from "../../types/document.ts";
import styles from "./history-table.module.css"
import {Link} from "react-router-dom";
import {useAuth} from "../../context/auth-context.tsx";
import {useDeleteDocument} from "../../hooks/queries.ts";

interface HistoryTableProps {
  docs: Document[] | undefined
}

export function HistoryTable ({docs} : HistoryTableProps): React.JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const deleteMutation = useDeleteDocument();

  const hasAnySelected = selectedIds.length > 0;

  useEffect(() => {
    if (!hasAnySelected) {
      setShowConfirm(false);
    }
  }, [hasAnySelected]);

  const toggleCheckbox = (docId: string) => {
    setSelectedIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleDeleteClick = () => {
    if (hasAnySelected) {
      setShowConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Ошибка при удалении документов:", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.history}>
        <div className={styles.label}>
          <p className={styles.filename}>название</p>
          <p className={styles.date}>дата</p>
          <button className={styles.delete}
                  onClick={handleDeleteClick}
                  disabled={!hasAnySelected || deleteMutation.isPending}
          >
            <img
              src={hasAnySelected && !deleteMutation.isPending ? "/img/delete_red.svg" : "/img/delete_gray.svg"}
              alt="delete"
              width="11"
              height="11"
            />
          </button>
        </div>

        {showConfirm && (
          <div className={styles.confirm}>
            <p className={styles.confirm_text}>
              Вы точно хотите удалить?
            </p>
            <button className={styles.yes} onClick={handleConfirmDelete}>
              да
            </button>
            <button className={styles.no} onClick={handleCancelDelete}>
              нет
            </button>
          </div>
        )}

        {docs?.length === 0 ? (
          <div className={styles.string}>
            <p className={`${styles.doc_name} ${styles.empty}`}>здесь будет история твоих документов :)</p>
            <p className={`${styles.doc_date} ${styles.empty}`}>00.00.0000</p>
          </div>
        ) : (
          docs?.map((doc) => (
            <div
              key={doc.id}
              className={`${styles.string} ${selectedIds.includes(doc.id) ? styles.selected : ''}`}
            >
              <label className={styles.wrapper}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={selectedIds.includes(doc.id)}
                  onChange={() => toggleCheckbox(doc.id)}
                />
                <div className={styles.custom}></div>
              </label>

              <Link to={`/account/${user?.id}/documents/${doc.id}`} className={styles.doc_data}>
                <p className={styles.doc_name}>{doc.filename}</p>
                <p className={styles.doc_date}>
                  {new Date(doc.created_at).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <div className={styles.delete_placeholder} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
