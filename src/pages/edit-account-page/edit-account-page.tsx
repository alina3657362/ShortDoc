import styles from './edit-account-page.module.css';
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import MemoizedHeader from "../../components/header/header.tsx";
import {useAuth} from "../../context/auth-context.tsx";

export function EditAccountPage(): React.JSX.Element {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div>
      <Helmet>
        <title>ShortDoc: {user?.nickname}</title>
      </Helmet>
      <MemoizedHeader />
      <div className={styles.wrapper}>
        <img src='/img/user_active.svg' alt="user icon" width='106' height='106' />
        <div className={styles.container}>
          <p className={styles.title}>Редактирование личных данных</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.string}>
              <label htmlFor='nickname' className={styles.label}>Имя пользователя</label>
              <input
                type='text'
                className={styles.input}
                id='nickname'
                defaultValue={user?.nickname}
              />
            </div>

            <div className={styles.string}>
              <label htmlFor='email' className={styles.label}>Почта</label>
              <input
                type='email'
                className={`${styles.input} ${!isEmailValid ? styles.error : ''}`}
                id='email'
                defaultValue={user?.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type='submit' className={styles.save}>Сохранить</button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <img src='/img/modal.svg' alt='saved icon' width='35' height='35' />
            <p>Ваши данные успешно изменены<br/>в личном кабинете</p>
            <button className={styles.button} onClick={() => setIsModalOpen(false)}>Хорошо</button>
          </div>
        </div>
      )}
    </div>
  );
}
