import React, {useEffect, useState} from "react";
import styles from './pop-up.module.css';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";

export function PopUp(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`${styles.container} ${isVisible ? `${styles.show}` : ''}`}>
      <div className={styles.content}>
        <div className={styles.row}>
          <p className={styles.text}>История упрощенных документов сохранится если</p>
          <button className={styles.close} onClick={handleClose}>
            <img src="/img/close.svg" alt="close" width="9px" height="9"/>
          </button>
        </div>
        <Link to={AppRoute.Login} className={styles.link}>Зарегистрироваться →</Link>
      </div>
    </div>
  );
}
