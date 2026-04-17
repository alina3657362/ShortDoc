import React, { useState } from "react";
import { Logo } from "../../components/logo/logo.tsx";
import { Helmet } from "react-helmet-async";
import styles from './login-page.module.css';
import { Link } from "react-router-dom";
import { AppRoute } from "../../const.ts";

export function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const clearEmail = () => setEmail('');
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Проверка, что оба поля заполнены
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Логика входа
      alert('Форма отправлена!');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>ShortDoc: Войти</title>
      </Helmet>
      <div className={styles.header}>
        <Logo />
      </div>
      <h1 className={styles.title}>Вход</h1>
      <p className={styles.form_text}>
        Нет аккаунта?{' '}
        <Link to={AppRoute.Register} className={styles.blue}>
          Зарегистрируйтесь
        </Link>
      </p>

      <form className={styles.form_container} onSubmit={handleSubmit}>
        <div className={styles.input_wrapper}>
          <label htmlFor="email" className={styles.form_label}>
            Электронная почта
          </label>
          <div className={styles.input_container}>
            <input
              className={styles.form_input}
              id="email"
              type="email"
              placeholder=" "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={styles.placeholder}>Введите почту</span>
            {email && (
              <button
                type="button"
                className={styles.clear_button}
                onClick={clearEmail}
                aria-label="Очистить поле email"
              >
                <img src="/img/clear.svg" alt="clear" width="9" height="9" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="password" className={styles.form_label}>
            Пароль
          </label>
          <div className={styles.input_container}>
            <input
              className={styles.form_input}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={styles.placeholder}>Введите пароль</span>
            <button
              type="button"
              className={styles.toggle_password_button}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </div>

        <button
          className={styles.login_button}
          type="submit"
          disabled={!isFormValid}
        >
          Войти
        </button>
      </form>

      <Link to="" className={styles.forget}>
        Забыли пароль?
      </Link>
    </div>
  );
}
