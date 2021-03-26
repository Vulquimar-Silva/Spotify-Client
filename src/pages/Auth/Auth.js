import React, { useState } from 'react';
import AuthOptions from "../../components/Auth/AuthOptions";
import RegisterForm from "../../components/Auth/RegisterForm";
import LoginForm from "../../components/Auth/LoginForm";
import BackgroundApp from "../../assets/jpg/background-auth.jpg";
import LogoNameWhite from "../../assets/png/logo-name-green-remove.png";

import "./Auth.scss"

export default function Auth() {
  const [selectedForm, setSelectedForm] = useState(null);

  const handlerForm = () => {
    switch (selectedForm) {
      case "login":
        return <LoginForm setSelectedForm={setSelectedForm} />
      case "register":
        return <RegisterForm setSelectedForm={setSelectedForm} />
      default:
        return <AuthOptions setSelectedForm={setSelectedForm} />
      }
  }

  return (
    <div className="auth" style={{ background: `url(${BackgroundApp})`}}>
      <div className="auth__dark" />

      <div className="auth__box" >
        <div className="auth__box-logo">
          <img src={LogoNameWhite} alt="Vulksfy"/>
        </div>
        {handlerForm()}
      </div>
    </div>
  )
}
