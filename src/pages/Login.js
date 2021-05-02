import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { Redirect } from "react-router-dom";

import LoginComponent from "../components/login";

export const Login = () => {
  // useAuth();
  // const user = useSelector((state) => {
  //   return state.signInReducer.data;
  // });
  // if (user) {
  //   return <Redirect to={`/`} />;
  // }
  return <LoginComponent />;
};
