import React, {memo, useState} from "react";
import MemoizedLogo from "../logo/logo.tsx";
import styles from './header.module.css';
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../const.ts";
import { useAuth } from "../../context/auth-context.tsx";
import {ConfirmModal} from "../confirm-modal/confirm-modal.tsx";

function Header(): React.JSX.Element {
  const { isAuth, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate(AppRoute.Upload);
  };

  if (isLoading) return <></>;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <MemoizedLogo />
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
          <button className={styles.logout} onClick={handleLogoutClick}>
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

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}

const MemoizedHeader = memo(Header);

export default MemoizedHeader;
