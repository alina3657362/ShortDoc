import React from "react";
import { Logo } from "../logo/logo.tsx";
import styles from './header.module.css';
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../const.ts";
import { useAuth } from "../../context/auth-context.tsx";

export function Header(): React.JSX.Element {
  const { isAuth, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(AppRoute.Login);
  };

  const handleAccountClick = () => {
    if (!isAuth) {
      navigate(AppRoute.Login);
      return;
    }

    if (!user?.id) {
      return;
    }

    navigate(`/account/${user.id}`);
  };

  if (isLoading) return <></>;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.icons}>
        <div
          onClick={handleAccountClick}
          style={{ cursor: 'pointer' }}
        >
          <img
            className={styles.account}
            src={isAuth ? "/img/user_active.svg" : "/img/user_disable.svg"}
            alt="user account icon"
            width="44"
            height="44"
          />
        </div>

        {isAuth && (
          <button className={styles.logout} onClick={handleLogout}>
            <img
              className={styles.out}
              src="/img/out.svg"
              alt="logout icon"
              width="44"
              height="44"
            />
          </button>
        )}
      </div>
    </div>
  );
}
