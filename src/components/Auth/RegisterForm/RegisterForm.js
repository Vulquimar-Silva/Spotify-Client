import React, { useState } from 'react';
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import { validateEmail } from "../../../utils/Validations";

import "./RegisterForm.scss"

export default function RegisterForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handlerShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = () => {
    
    setFormError({});
    let errors = {};
    let formOk = true;

    if(!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }

    if(formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }

    if(!formData.username) {
      errors.username = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(() => {
        changeUserName();
        sendVerificationEmail();
      })
      .catch(() => {
      toast.error("Erro ao criar conta.")
      })
      .finally(() => {
      setIsLoading(false);
      setSelectedForm(null);
      })
    }
  }

  const changeUserName = () => {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: formData.username
      })
      .catch(() => {
        toast.error("Erro ao atualizar usuário.")
      });
  };

  const sendVerificationEmail = () => {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      toast.success("Foi encaminhado um email de verificação para você.")
    }).catch(() => {
      toast.error("Erro ao enviar o email de verificação.")
    })
  }

  return (
    <div className="register-form">
      <h1>Comece a ouvir músicas grátis</h1>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input 
            type="text"
            name="email"
            placeholder="Digite seu email"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, entre com um e-mail válido.
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input 
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Entre com sua senha"
            icon={
              showPassword ? (
                <Icon name="eye slash outline" link onClick={handlerShowPassword} />
              ) : (
                <Icon name="eye" link onClick={handlerShowPassword} />
              )
            }
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              Digite uma senha superior a 5 caracteres.
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input 
            type="text"
            name="username"
            placeholder="Qual é o seu nome?"
            icon="user circle outline"
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">
              Por favor, digite o seu nome.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Continuar
        </Button>
      </Form>

      <div className="register-form__options">
        <p onClick={() => { setSelectedForm(null)}}>Voltar</p>
        <p>
          Já tem conta? <span onClick={() => setSelectedForm("login")}>Iniciar sessão</span>
        </p>
      </div>
    </div>
  )
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: ""
  }
}