import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';

import './Dashboard.css'
import Header from '../../components/Header';
import Title from '../../components/Title';

import { Link } from 'react-router-dom';

function Dashboard() {

  const { logout } = useContext(AuthContext);

  const [ chamado, setChamados] = useState([]);

  return (
    <div className="wrap">
      <Header />
      <div className="subwrap">
        <Title><i class="fas fa-phone-square-alt"></i>Chamados</Title>

        {setChamados.length ?
        (
          <>
            <span>Nenhum chamado registrado.</span>
            <Link className="btn-primary" to="/new">Novo Chamado</Link>
          </>
        ) : (
          <Link className="btn-primary" to="/new">Novo Chamado</Link>
        )}
      </div>
    </div>
  )
}

export default Dashboard;