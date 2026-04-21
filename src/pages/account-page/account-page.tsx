import React from "react";
import {Helmet} from "react-helmet-async";
import {Header} from "../../components/header/header.tsx";
import styles from './account-page.module.css';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";
import {mockDocuments} from "../../mocks/documents.ts";
import {mockUser} from "../../mocks/user.ts";
import {HistoryTable} from "../../components/history-table/history-table.tsx";

export function AccountPage() : React.JSX.Element {
  const docs = mockDocuments;
  const user = mockUser;

  return (
    <div>
      <Helmet>
        <title>ShortDoc: {user.nickname}</title>
      </Helmet>
      <Header />
      <div className={styles.container}>
        <div className={styles.user}>
          <img src="/img/auth.svg" alt="user icon" width="106" height="106"/>
          <div className={styles.wrapper}>
            <h1 className={styles.nickname}>@{user.nickname}</h1>
            <Link to={AppRoute.Edit} className={styles.edit}>Редактировать</Link>
          </div>
        </div>
        <HistoryTable docs={docs} />
      </div>
    </div>
  )
}
