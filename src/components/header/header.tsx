import React from "react";
import {Logo} from "../logo/logo.tsx";
import styles from './header.module.css';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";

export function Header(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.icons}>
        <Link to={AppRoute.Account}>
          <img className={styles.account} src="/img/user_active.svg" alt="user account icon" width="44" height="44"/>
        </Link>
        <button className={styles.logout}>
          <img className={styles.out} src="/img/out.svg" alt="loguot icon" width="44" height="44"/>
        </button>
      </div>
    </div>
  )
}
