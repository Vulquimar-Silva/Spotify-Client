import React, { useState } from 'react'
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";

import "./LoginForm.scss"

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm());
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = {};

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }

    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setIsLoading(true)
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(response => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);
            if(!response.user.emailVerified) {
              toast.warning(
                "Para você logar, antes verifique sua caixa de email e valide sua conta."
              );
            }
          
        })
        .catch(err => {
          handlerErrors(err.code);
        })
        .finally(() => {
          setIsLoading(false);
      })
    }
  }
  
  return (
    <div className="login-form">
      <h1>Música para todos</h1>

      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input 
            type="text"
            name="email"
            placeholder="Entre com seu email"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, entre com um email válido.
            </span>
          )}
        </Form.Field>
        
        <Form.Field>
          <Input 
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Entre com sua senha"
            error={formError.password}
            icon={
              showPassword ? (
                <Icon 
                  name="eye slash outline"
                  link
                  onClick={handlerShowPassword}
                />
              ) : (
                 <Icon 
                    name="eye"
                    link
                    onClick={handlerShowPassword}
                /> 
              )
            }
          />
          {formError.password && (
            <span className="error-text">
              Digite uma senha que seja superior a 5 caracteres.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Iniciar sessão
        </Button>
      </Form>

      {!userActive && (
        <ButtonResetSendEmailVerification 
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}

      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Voltar</p>

        <p>
          Ainda não tem uma conta?
          <span onClick={() => {setSelectedForm("register")}}>Criar conta</span>
        </p>
      </div>
    </div>
  )
}

function ButtonResetSendEmailVerification(props) {
  const { user, setIsLoading, setUserActive } = props;

  const resendVerificationEmail = () => {
    user.sendEmailVerification().then(() => {
      toast.success("Foi encaminhado para você um email de verificação.")
    })
      .catch(err => {
        handlerErrors(err.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
    })
  }

  return (
    <div className="resend-verification-email">
      <p>
        Caso não tenha recebido o email na caixa de entrada ou span clique <span onClick={resendVerificationEmail}>aqui.</span>
      </p>
    </div>
  )
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("Usuário e senha estão incorretos.")
      break;
    case "auth/too-manu-request":
      toast.warning("Você solicitou o reenvio de email de confirmação em pouco tempo, aguarde 2 minutos e tente novamente.");
      break;
    case "auth/user-not-found":
      toast.warning("Usuário e senha estão incorretos.")
      break;
    default:
      break;
  }
}

function defaultValueForm() {
  return {
    email: "",
    password: ""
  }
}