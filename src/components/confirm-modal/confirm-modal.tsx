import React from "react";
import styles from "./confirm-modal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ isOpen, onClose, onConfirm,}: ConfirmModalProps) : React.JSX.Element{

  if (!isOpen) return <div></div>;

  return (
  <div className={styles.modal} onClick={onClose}>
      <p className={styles.text}>Вы точно хотите выйти?</p>

      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.confirm}
          onClick={onConfirm}
        >
          да
        </button>

        <button
          type="button"
          className={styles.cancel}
          onClick={onClose}
        >
          нет
        </button>
      </div>
    </div>
  );
}
