import React from "react";
import {Helmet} from "react-helmet-async";
import MemoizedHeader from "../../components/header/header.tsx";
import styles from './account-page.module.css';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";
import {HistoryTable} from "../../components/history-table/history-table.tsx";
import {useAuth} from "../../context/auth-context.tsx";
import {useDocumentsList} from "../../hooks/queries.ts";

export function AccountPage() : React.JSX.Element {
  const { user } = useAuth();

  const docs = useDocumentsList();

  React.useEffect(() => {
    const refetchDocuments = () => {
      docs.refetch();
    };

    refetchDocuments();

  }, [docs]);

  return (
    <div>
      <Helmet>
        <title>ShortDoc: {user?.nickname || "Ошибка отображения ника"}</title>
      </Helmet>
      <MemoizedHeader />
      <div className={styles.container}>
        <div className={styles.user}>
          <img src="/img/auth.svg" alt="user icon" width="106" height="106"/>
          <div className={styles.wrapper}>
            <h1 className={styles.nickname}>@{user?.nickname}</h1>
            <Link to={AppRoute.EditAccount} className={styles.edit}>редактировать</Link>
          </div>
        </div>
        <HistoryTable docs={docs.data?.items} />
      </div>
    </div>
  )
}
