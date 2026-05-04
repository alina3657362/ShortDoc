import React from "react";
import styles from './document-page.module.css';
import {Helmet} from "react-helmet-async";
import {Header} from "../../components/header/header.tsx";
import {ReadArea} from "../../components/read-area/read-area.tsx";
import {Link, useLocation, useParams} from "react-router-dom";
import {AppRoute} from "../../const.ts";
import {useDocumentById, useDocumentSummary} from "../../hooks/queries.ts";
import type {DocumentPageState} from "../../types/document-page-state.ts";

export function DocumentPage() : React.JSX.Element {
  const { documentId } = useParams<{ documentId: string }>();
  const location = useLocation();
  const state = location.state as DocumentPageState | null;

  const isGuestMode = !documentId && !!state;

  const { document } = useDocumentById(documentId || '');
  const { data: serverSummary } = useDocumentSummary(documentId || '');

  const filename = isGuestMode ? state?.filename : document?.filename;
  const text = state?.text;
  const summary = isGuestMode ? state?.summary : serverSummary?.summary;

  return (
    <div className={styles.page}>
      <Helmet>
        <title>ShortDoc: {filename}</title>
      </Helmet>
      <Header />
      <div className={styles.container}>
        <div className={styles.read_area}>
          <h2 className={styles.title}>Документ:</h2>
          <div className={styles.text}>
            <ReadArea text={text || "Ошибка при получении текста"} />
          </div>
        </div>
        <div className={styles.read_area}>
          <h2 className={styles.title}>Итог:</h2>
          <div className={styles.text}>
            <ReadArea text={summary || "Ошибка при обработке текста"} />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Link to={AppRoute.Upload}>
          <button className={styles.button}>Упростить новый документ</button>
        </Link>
        <p className={styles.comment}>Сокращенный документ создан в соавторстве с AI</p>
      </div>
    </div>
  )
}
