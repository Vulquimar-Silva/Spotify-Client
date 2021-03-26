import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserPassword(props) {
  const { setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Atualizar senha");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };

  return (
    <div className="user-password">
      <h3>Senha: *** *** *** ***</h3>
      <Button circular onClick={onEdit}>
        Atualizar
      </Button>
    </div>
  );
}

function ChangePasswordForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      toast.warning("As senhas não podem estar vazias.");
    } else if (formData.currentPassword === formData.newPassword) {
      toast.warning("As novas senhas não pode ser igual a atual.");
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      toast.warning("As senhas não são iguais.");
    } else if (formData.newPassword.length < 6) {
      toast.warning("A senha tem que ter no minimo 6 caracteres.");
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPassword)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updatePassword(formData.newPassword)
            .then(() => {
              toast.success("Senha atualizada.");
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(err => {
              alertErrors(err?.code);
              setIsLoading(false);
            });
        })
        .catch(err => {
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Senha atual"
          type={showPassword ? "text" : "password"}
          onChange={e =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          icon={
            <Icon
              name={showPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nova senha"
          type={showPassword ? "text" : "password"}
          onChange={e =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          icon={
            <Icon
              name={showPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Repetir nova senha"
          type={showPassword ? "text" : "password"}
          onChange={e =>
            setFormData({ ...formData, repeatNewPassword: e.target.value })
          }
          icon={
            <Icon
              name={showPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Atualizar senha
      </Button>
    </Form>
  );
}
