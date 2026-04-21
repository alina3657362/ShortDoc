import React, {useState} from "react";
import type {Document} from "../../types/document.ts";
import styles from "./history-table.module.css"
import {Link} from "react-router-dom";
import {mockUser} from "../../mocks/user.ts";

interface HistoryTableProps {
  docs: Document[]
}

export function HistoryTable ({docs} : HistoryTableProps): React.JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const user = mockUser;

  const hasAnySelected = selectedIds.length > 0;

  const toggleCheckbox = (docId: string) => {
    setSelectedIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.history}>
        <div className={styles.label}>
          <p className={styles.filename}>Название</p>
          <p className={styles.date}>Дата</p>
          <button className={styles.delete} disabled={!hasAnySelected}>
            <img
              src={hasAnySelected ? "/img/delete_red.svg" : "/img/delete_gray.svg"}
              alt="delete"
              width="11"
              height="11"
            />
          </button>
        </div>
        {docs.map((doc) => (
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

            <Link to={`/${user.nickname}/documents/${doc.id}`} className={styles.doc_data}>
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
        ))}
      </div>
    </div>
  );
}
