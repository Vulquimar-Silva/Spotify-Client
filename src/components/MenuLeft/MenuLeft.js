import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { isUserAdmin } from "../../utils/Api";
import BasicModal from "../Modal/BasicModal"

import "./MenuLeft.scss";

function MenuLeft(props) {
  const { user, location } = props;
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [userAdmin, setUserAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  useEffect(() => {
    setActiveMenu(location.pathname)
  }, [location]);

  useEffect(() => {
    isUserAdmin(user.uid).then(response => {
      setUserAdmin(response);
    })
  }, [user]);

  const handlerMenu = (e, menu) => {
    setActiveMenu(menu.to)
  };

  const handlerModal = (type) => {
    switch (type) {
      case "artist":
        setTitleModal("Novo artista");
        setContentModal(<h2>Formulario novo artista</h2>);
        setShowModal(true);
        break;
      
        case "song":
        setTitleModal("Nova canção");
        setContentModal(<h2>Formulario nova canção</h2>);
        setShowModal(true);
        break;
    
      default:
        setTitleModal(null);
        setContentModal(null);
        setShowModal(false);
        break;
    }
  }

  return (
    <>
    <Menu className="menu-left" vertical>
      <div className="top">
        <Menu.Item as={Link} to="/" name="home" active={activeMenu === "/"} onClick={handlerMenu}>
          <Icon name="home" /> Inicio
        </Menu.Item>

        <Menu.Item as={Link} to="/artists" name="artists" active={activeMenu === "/artists"} onClick={handlerMenu}>
          <Icon name="music" /> Artistas
        </Menu.Item>
      </div>

      {userAdmin && (

        <div className="footer">

          <Menu.Item onClick={() => handlerModal("artist")}>
            <Icon name="plus square outline" /> Novo Artista
          </Menu.Item>

            <Menu.Item onClick={() => handlerModal("song")}>
            <Icon name="plus square outline" /> Nova Canção
          </Menu.Item>

        </div>

      )}
    </Menu>

      <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </BasicModal>
    </>
  )
}

export default withRouter(MenuLeft)