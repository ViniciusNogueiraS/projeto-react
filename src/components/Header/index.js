import React, { useContext } from "react";
import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom';

import avatar from '../../assets/imgs/user_icon.png';
import './Header.css'

export default function Header() {

  const { user, logout } = useContext(AuthContext);

  return (
    <div className="header">
      <div className="user">
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl} width="70" height="70"/>
        <span>{user.nome}</span>
      </div>
      <Link to="/dashboard" className="link-menu">
        <i class="fas fa-phone-square-alt"></i>
        <span>Chamados</span>
      </Link>
      <Link to="/custumers" className="link-menu">
        <i class="fas fa-users"></i>
        <span>Clientes</span>
      </Link>
      <Link to="/profile" className="link-menu">
        <i class="fas fa-cogs"></i>
        <span>Configurações</span>
      </Link>
      <button onClick={logout} className="btn-logout">
        <i class="fas fa-door-open"></i>
        <span>Sair</span>
      </button>
    </div>
  )
}