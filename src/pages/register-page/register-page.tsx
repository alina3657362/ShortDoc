import React, { useState } from "react";
import styles from './register-page.module.css';
import { Helmet } from "react-helmet-async";
import MemoizedLogo from "../../components/logo/logo.tsx";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "../../const.ts";
import { useAuth } from "../../context/auth-context.tsx";
import { useRegister } from "../../hooks/queries.ts";

export function RegisterPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login: loginUser } = useAuth();
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [repeatPasswordTouched, setRepeatPasswordTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/.test(password);
  const doPasswordsMatch = password === repeatPassword && repeatPassword !== '';

  const isFormValid =
    isEmailValid &&
    nickname.trim() !== '' &&
    isPasswordValid &&
    doPasswordsMatch &&
    isChecked;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const cleanNickname = nickname.trim().replace(/^@+/, '');

    try {
      await registerMutation.mutateAsync({
        email,
        nickname: cleanNickname,
        password,
      });

      await loginUser({ email, password });

      navigate(AppRoute.Upload);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>ShortDoc: Зарегистрироваться</title>
      </Helmet>

      <div className={styles.header}>
        <MemoizedLogo />
      </div>

      <h1 className={styles.title}>
        Добро пожаловать в ShortDoc 👋 <br />
        С нами ознакомиться с документами станет проще 🚀
      </h1>
      <p className={styles.form_text}>Введите данные для регистрации</p>

      <form className={styles.form_container} onSubmit={handleSubmit}>
        <div className={styles.input_wrapper}>
          <label htmlFor="email" className={styles.form_label}>
            Электронная почта
          </label>
          <div className={styles.input_container}>
            <input
              className={`${styles.form_input} ${emailTouched && !isEmailValid ? styles.error : ''}`}
              id="email"
              type="email"
              placeholder=" "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
            />
            <span className={styles.placeholder}>Введите почту</span>
          </div>
          {emailTouched && !isEmailValid && email && (
            <p className={styles.error_message}>Некорректный формат email</p>
          )}
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="nickname" className={styles.form_label}>
            Имя пользователя
          </label>
          <div className={styles.input_container}>
            <input
              className={styles.form_input}
              id="nickname"
              type="text"
              placeholder=" "
              required
              value={nickname}
              onChange={(e) => {
                const value = e.target.value;
                setNickname(value);
              }}
            />
            <span className={styles.placeholder}>@nickname</span>
          </div>
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="password" className={styles.form_label}>
            Пароль
          </label>
          <div className={styles.input_container}>
            <input
              className={`${styles.form_input} ${passwordTouched && !isPasswordValid ? styles.error : ''}`}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
            />
            <span className={styles.placeholder}>Придумайте пароль</span>

            <button
              type="button"
              className={styles.toggle_password_button}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? (
                <img src="/img/view.png" alt="visible" width="16" height="16" />
              ) : (
                <img src="/img/eyebrow.png" alt="invisible" width="16" height="16" />
              )}
            </button>
          </div>
          {passwordTouched && !isPasswordValid && password && (
            <p className={styles.error_message}>
              Пароль должен содержать минимум 8 символов, хотя бы одну букву и одну цифру
            </p>
          )}

          <div className={`${styles.input_container} ${styles.repeat}`}>
            <input
              className={`${styles.form_input} ${repeatPasswordTouched && !doPasswordsMatch ? styles.error : ''}`}
              id="repeat_password"
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              onBlur={() => setRepeatPasswordTouched(true)}
            />
            <span className={styles.placeholder}>Повторите пароль</span>
          </div>
          {repeatPasswordTouched && !doPasswordsMatch && repeatPassword && (
            <p className={styles.error_message}>Пароли не совпадают</p>
          )}
        </div>
      </form>

      <form className={styles.personal_container}>
        <input
          type="checkbox"
          id="personalDataCheckbox"
          className={styles.personal_input}
          required
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="personalDataCheckbox" className={styles.personal_label}>
          <span className={styles.personal_text}>
            Я прочитал(a){' '}
            <Link to="/public/Правила использования сервиса.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.personal_link}
            >
              соглашение
            </Link>
            {' '}и даю согласие<br />на обработку персональных данных
          </span>
        </label>
      </form>

      <button
        className={styles.button}
        type="submit"
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        Зарегистрироваться
      </button>

      <p className={styles.register}>
        Есть аккаунт?{' '}
        <Link to={AppRoute.Login} className={styles.blue}>
          Войдите
        </Link>
      </p>
    </div>
  );
}
