import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom';

import './SignIn.css';

function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (email !== '' && password !== '') {
      signIn(email, password);
    }
  }

  return (
    <div className="container-center">
      <form className="login" onSubmit={handleSubmit}>
        <h1 className="title">Login</h1>
        <input className="input-t" type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        <input className="input-t" type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)}/>
        {loadingAuth ?
          (<button className="btn-primary loading" disabled type="submit">Carregando...</button>)
          :
          (<button className="btn-primary" type="submit">Acessar</button>)
        }
        <Link className="link-primary" to="/register">Cadastrar nova conta</Link>
      </form>
    </div>
  )
}

export default SignIn;