import React from "react";
import { Helmet } from "react-helmet-async";
import MemoizedHeader from "../../components/header/header.tsx";
import styles from "./account-page.module.css";
import { Link } from "react-router-dom";
import { HistoryTable } from "../../components/history-table/history-table.tsx";
import { useAuth } from "../../context/auth-context.tsx";
import { useDocumentsList } from "../../hooks/queries.ts";

export function AccountPage(): React.JSX.Element {
  const { user } = useAuth();

  const docsQuery = useDocumentsList();

  return (
    <div>
      <Helmet>
        <title>
          ShortDoc: {user?.nickname || "Ошибка отображения ника"}
        </title>
      </Helmet>

      <MemoizedHeader />

      <div className={styles.container}>
        <div className={styles.user}>
          <img
            src="/img/auth.svg"
            alt="user icon"
            width="106"
            height="106"
          />

          <div className={styles.wrapper}>
            <h1 className={styles.nickname}>
              @{user?.nickname}
            </h1>

            <Link
              to={`/account/${user?.id}/edit`}
              className={styles.edit}
            >
              редактировать
            </Link>
          </div>
        </div>

        <HistoryTable
          docs={docsQuery.data?.items}
          isLoading={docsQuery.isLoading}
          error={docsQuery.error}
          onRefresh={docsQuery.refetch}
        />
      </div>
    </div>
  );
}
