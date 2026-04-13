import React from "react";
import {Logo} from "../logo/logo.tsx";
import styles from './header.module.css';

export function Header(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.icons}>
        <img className={styles.account} src="/img/user_disable.svg" alt="user account icon" width="44" height="44"/>
        <img className={styles.out} src="/img/out.svg" alt="out of account icon" width="44" height="44"/>
      </div>
    </div>
  )
}
