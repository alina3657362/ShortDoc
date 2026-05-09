import React from "react";
import styles from './user-document-page.module.css';
import {Helmet} from "react-helmet-async";
import MemoizedHeader from "../../components/header/header.tsx";
import {ReadArea} from "../../components/read-area/read-area.tsx";
import {Link, useParams} from "react-router-dom";
import {AppRoute} from "../../const.ts";
import {useAuth} from "../../context/auth-context.tsx";
import {useDocumentSummary, useDocumentText} from "../../hooks/queries.ts";

export function UserDocumentPage() : React.JSX.Element {
  const { documentId } = useParams<{ documentId: string }>();
  const { data: document } = useDocumentText(documentId || "")
  const { data: summary } = useDocumentSummary(documentId || '');
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <Helmet>
        <title>
          {document?.filename
            ? `ShortDoc: ${document?.filename}`
            : "ShortDoc: Просмотр документа"}
        </title>
      </Helmet>
      <MemoizedHeader />
      <div className={styles.title_page}>
        <Link to={`/account/${user?.nickname}`} className={styles.back}>
          <p>← в историю</p>
        </Link>
        <p className={styles.filename}>{document?.filename}</p>
        <p className={styles.spacer}></p>
      </div>

      <div className={styles.container}>
        <div className={styles.read_area}>
          <h2 className={styles.title}>Документ:</h2>
          <div className={styles.text}>
            <ReadArea text={document?.text || "Ошибка при загрузке текста"} />
          </div>
        </div>
        <div className={styles.read_area}>
          <h2 className={styles.title}>Итог:</h2>
          <div className={styles.text}>
            <ReadArea text={summary?.summary || "Ошибка при загрузке текста"} />
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
