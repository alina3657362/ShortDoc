import styles from './edit-account-page.module.css';
import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet-async";
import MemoizedHeader from "../../components/header/header.tsx";
import {useAuth} from "../../context/auth-context.tsx";
import {useNavigate} from "react-router-dom";
import type {UpdateMeRequest} from "../../types/update-me-request.ts";

export function EditAccountPage(): React.JSX.Element {
  const { user, updateUser } = useAuth();
  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordsTouched, setPasswordsTouched] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  const isNicknameChanged = nickname !== user?.nickname;

  const isPasswordChanged = newPassword !== '' || repeatPassword !== '' || currentPassword !== '';

  const isPasswordValid = !isPasswordChanged || (/^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/.test(newPassword));
  const doPasswordsMatch = !isPasswordChanged || (newPassword === repeatPassword && repeatPassword !== '');

  const isFormValid =
    (isNicknameChanged || isPasswordChanged) &&
    nickname?.trim() !== '' &&
    isPasswordValid &&
    doPasswordsMatch;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: UpdateMeRequest = {
        nickname,
      };

      if (isPasswordChanged) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      await updateUser(payload);

      setIsModalOpen(true)
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
    }
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();

    setIsModalOpen(false);
    navigate(`/account/${user?.id}`);
  }

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

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
                value={nickname ?? ''}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className={styles.string}>
              <label htmlFor='currentPassword' className={styles.label}>Старый пароль</label>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className={styles.input}
                id='currentPassword'
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <button
                type="button"
                className={styles.toggle_password_button}
                onClick={toggleCurrentPasswordVisibility}
                aria-label={showCurrentPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showCurrentPassword ? (
                  <img src="/img/view.png" alt="visible" width="16" height="16" />
                ) : (
                  <img src="/img/eyebrow.png" alt="invisible" width="16" height="16" />
                )}
              </button>
            </div>

            <div className={styles.string}>
              <label htmlFor='newPassword' className={styles.label}>Новый пароль</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`${styles.input} ${!isPasswordValid && passwordsTouched ? styles.error : ''}`}
                id='newPassword'
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setPasswordsTouched(true)}
              />

              <button
                type="button"
                className={styles.toggle_password_button}
                onClick={toggleNewPasswordVisibility}
                aria-label={showNewPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showNewPassword ? (
                  <img src="/img/view.png" alt="visible" width="16" height="16" />
                ) : (
                  <img src="/img/eyebrow.png" alt="invisible" width="16" height="16" />
                )}
              </button>
            </div>

            {passwordsTouched && !isPasswordValid && newPassword !== '' && (
              <div className={styles.string}>
                <div className={styles.empty}></div>
                <p className={styles.error_text}>
                  Пароль должен содержать минимум 8 символов, хотя бы одну букву и одну цифру
                </p>
              </div>
            )}

            <div className={styles.string}>
              <label htmlFor='repeatPassword' className={styles.label}>Повторите пароль</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`${styles.input} ${!doPasswordsMatch && passwordsTouched ? styles.error : ''}`}
                id='repeatPassword'
                onChange={(e) => setRepeatPassword(e.target.value)}
                onBlur={() => setPasswordsTouched(true)}
              />
            </div>

            {passwordsTouched && !doPasswordsMatch && repeatPassword !== '' && (
              <div className={styles.string}>
                <div className={styles.empty}></div>
                <p className={styles.error_text}>
                  Пароли не совпадают
                </p>
              </div>
            )}

            <button
              type='submit'
              className={`${styles.save} ${!isFormValid ? styles.disabled : ''}`}
              disabled={!isFormValid}
            >
              Сохранить
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <img src='/img/modal.svg' alt='saved icon' width='35' height='35' />
            <p>Ваши данные успешно изменены<br/>в личном кабинете</p>
            <button className={styles.button} onClick={handleClose}>Хорошо</button>
          </div>
        </div>
      )}
    </div>
  );
}
