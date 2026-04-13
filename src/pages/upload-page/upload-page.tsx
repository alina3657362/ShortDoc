import React, { useState } from 'react';
import {Helmet} from 'react-helmet-async';
import {Header} from "../../components/header/header.tsx";
import {Link} from "react-router-dom";
import {DragAndDrop} from "../../components/drag-and-drop/drag-and-drop.tsx";
import {FileView} from "../../components/file-view/file-view.tsx";
import styles from './upload-page.module.css';
import {PopUp} from "../../components/pop-up/pop-up.tsx";

export function UploadPage(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>ShortDoc</title>
      </Helmet>
      <Header />
      <PopUp />
      <div className={styles.container}>
        <section className={styles.text}>
          <h1 className={styles.title}><span className={styles.blue}>Упростить </span>документ <br/>в один клик</h1>
          <h3 className={styles.description}>ShortDoc сделает ваш документ ясным и легким. Избавьтесь<br/>от информационной перегрузки. Это не юридическая консультация. </h3>
        </section>
        <section className={styles.files}>
          {!file ? (
            <DragAndDrop onFileSelect={handleFileSelect} />
          ) : (
            <FileView file={file} onRemove={handleRemoveFile} />
          )}
        </section>
      </div>
      <footer className={styles.footer}>
        <p className={styles.footer_text}>Загружая свои документы на этот сайт вы соглашаетесь с</p>
        <Link to="" className={styles.privacy}>Положением о конфиденциальности</Link>
      </footer>
    </div>


  )
}
