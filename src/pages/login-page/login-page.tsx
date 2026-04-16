import React from "react";
import {Logo} from "../../components/logo/logo.tsx";
import {Helmet} from "react-helmet-async";
import styles from './login-page.module.css';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";

export function LoginPage() : React.JSX.Element {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>ShortDoc: Войти</title>
      </Helmet>
      <div className={styles.header}>
        <Logo/>
      </div>
      <h1 className={styles.title}>Вход</h1>
      <p className={styles.form_text}>Нет аккаунта? <Link to={AppRoute.Register} className={styles.blue}>Зарегистрируйтесь</Link></p>

      <form className={styles.form_container}>

        <div className={styles.input_wrapper}>
          <label htmlFor="email" className={styles.form_label}>Электронная почта</label>
          <div className={styles.input_container}>
            <input
              className={styles.form_input}
              id="email"
              type="email"
              placeholder=" "
            />
            <span className={styles.placeholder}>Введите почту</span>
          </div>
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="password" className={styles.form_label}>Пароль</label>
          <div className={styles.input_container}>
            <input
              className={styles.form_input}
              id="password"
              type="password"
              placeholder=" "
            />
            <span className={styles.placeholder}>Введите пароль</span>
          </div>
        </div>

      </form>
      <button className={styles.login_button} type='submit'>Войти</button>
      <Link to="" className={styles.forget}>Забыли пароль?</Link>
    </div>
  );
}
