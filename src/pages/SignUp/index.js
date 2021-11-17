import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth'

import './SignUp.css';

function SignUp() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (nome !== '' && email !== '' && password !== '') {
      signUp(nome, email, password);
    }
  }

  return (
    <div className="container-center">
      <form className="cadastro" onSubmit={handleSubmit}>
        <h1 className="title">Novo Usuário</h1>
        <div className="link-container">
          <Link className="link-back" to="/">Voltar</Link>
        </div>
        <input className="input-t" type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)}/>
        <input className="input-t" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        <input className="input-t" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)}/>
        {loadingAuth ?
          (<button className="btn-primary loading" disabled type="submit">Carregando...</button>)
          :
          (<button className="btn-primary" type="submit">Acessar</button>)
        }
      </form>
    </div>
  )
}

export default SignUp;