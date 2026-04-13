import React, {useState, useCallback, useRef} from 'react';
import styles from './drag-and-drop.module.css'

interface DragAndDropProps {
  onFileSelect: (file: File) => void;
}

export function DragAndDrop({ onFileSelect }: DragAndDropProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  }, [onFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const file = droppedFiles[0];

    onFileSelect(file);
  }, [onFileSelect]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <div
        className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <img className={styles.icon} src="/img/paper_upload.svg" alt="upload icon" width="45" height="53" />
        <div className={styles.text}>
          <h2 className={styles.title}>Выберите или перетащите файл</h2>
          <p className={styles.description}>Мы поддерживаем только .pdf</p>
        </div>
      </div>
    </>
  );
}
