import { useState } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { addDoc, collection } from 'firebase/firestore';
import connection from '../../service/firebaseConnection';
import { toast } from 'react-toastify';

import './Custumers.css';

export default function Custumers() {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');

  async function cadastrar(e) {
    e.preventDefault();
    
    if (nome === '' || cnpj === '' || endereco === '') {
      toast.error('Preencha todos os campos.');
      return;
    }

    await addDoc(collection(connection, 'custumers'), {
      nome: nome,
      cnpj: cnpj,
      endereco: endereco
    })
    .then(() => {
      setNome('');
      setCnpj('');
      setEndereco('');

      toast.success('Cliente cadastrado!');
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
    });
  }


  return (
    <div className="wrap">
      <Header />
      <div className="subwrap">
        <Title><i class="fas fa-users"></i>Clientes</Title>
        <form onSubmit={cadastrar} className="form-1">
          <label><span>Nome</span>
            <input type="text" className="input-t" placeholder="Nome da Empresa" value={nome} onChange={e => setNome(e.target.value)}/>
          </label>
          <label><span>CNPJ</span>
            <input type="text" className="input-t" placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)}/>
          </label>
          <label><span>Endereço</span>
            <input type="text" className="input-t" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)}/>
          </label>

          <button className="btn-secondary" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}