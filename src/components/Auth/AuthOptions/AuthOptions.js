import React from 'react';
import { Button } from "semantic-ui-react";

import "./AuthOptions.scss";

export default function AuthOptions(props) {
  const { setSelectedForm } = props;

  return (
    <div className="auth-options">
      <h2>Milhares de músicas grátis</h2>
      <Button className="register" onClick={() => setSelectedForm("register")}>
        Registrar
      </Button>

      <Button className="login" onClick={() => setSelectedForm("login")}>
        Iniciar sessão
      </Button>
    </div>
  )
}
