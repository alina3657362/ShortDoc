import React from 'react';
import {Link} from "react-router-dom";
import {AppRoute} from "../../const.ts";

export function Logo() : React.JSX.Element {
  return (
    <Link to={AppRoute.Upload}>
      <img className="" src="/img/logo.svg" alt="ShortDoc logo" width="120" height="32"/>
    </Link>
  )
}
