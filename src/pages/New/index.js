import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { getDoc, getDocs, query, doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import connection from '../../service/firebaseConnection';

import { AuthContext } from '../../contexts/auth'

import './New.css';

export default function New() {

  const history = useHistory();
  const { id } = useParams();

  const [custumers, setCustumers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [descricao, setDescricao] = useState('');

  const [editing, setEditing] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    let q = query(collection(connection, 'custumers'));

    async function loadCustomers() {
      await getDocs(q)
      .then(result => {
        let data = result.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });

        if (data.length === 0) {
          toast.info('Nenhum cliente encontrado.');
          setCustumers([]);
          return;
        }
        
        setCustumers(data);

        if (id) loadCallEdit(data);
      })
      .catch((erro) => {
        toast.error('Ops! Algo deu errado.');
        console.log(erro);
        setCustumers([ {cnpj: '', endereco: '', nome: ''} ])
      });
    }

    loadCustomers();
  }, []);

  async function loadCallEdit(lista) {
    await getDoc(doc(connection, 'calls', id))
    .then(result => {
      const call = result.data();

      let index = lista.findIndex(c => c.id === call.clienteId);
      setCustomerSelected(index);

      setAssunto(call.assunto);
      setStatus(call.status);
      setDescricao(call.descricao);
      
      setEditing(true);
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
      history.push('/dashboard');
    });
  }

  async function registrar(e) {
    e.preventDefault();

    await addDoc(collection(connection, 'calls'), {
      cliente: custumers[customerSelected].nome,
      clienteId: custumers[customerSelected].id,
      assunto: assunto,
      status: status,
      descricao: descricao,
      createdAt: new Date(),
      userId: user.id
    })
    .then(() => {
      setCustomerSelected(0);
      setAssunto('Suporte')
      setStatus('Aberto');
      setDescricao('');

      history.push('/dashboard');

      toast.success('Novo chamado registrado!');
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
    });
  }

  async function editar(e) {
    e.preventDefault();

    await updateDoc(doc(connection, 'calls', id), {
      cliente: custumers[customerSelected].nome,
      clienteId: custumers[customerSelected].id,
      assunto: assunto,
      status: status,
      descricao: descricao
    })
    .then(() => {
      history.push('/dashboard');

      toast.success('Chamado editado!');
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
    });
  }

  return (
    <div className="wrap">
      <Header/>
      <div className="subwrap">
        <Title>{editing ? "Edição de Chamado" : "Novo Chamado"}</Title>

        <form onSubmit={editing ? editar : registrar} className="form-1">
          <label><span>Cliente</span>
            <select className="input-s" value={customerSelected} onChange={e => setCustomerSelected(e.target.value)}>
              {custumers.map((c, index) => (
                <option key={c.id} value={index} selected={index === customerSelected}>{c.nome}</option>
              ))}
            </select>
          </label>
          <label><span>Assunto</span>
            <select className="input-s" value={assunto} onChange={e => setAssunto(e.target.value)}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Técnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </label>
          <label><span>Status</span>
            <div className="radio-group">
              <label><input type="radio" name="radio" onChange={e => setStatus(e.target.value)} checked={status === 'Aberto'} value="Aberto" className="input-r"/>Aberto</label>
              <label><input type="radio" name="radio" onChange={e => setStatus(e.target.value)} checked={status === 'Em Progresso'} value="Em Progresso" className="input-r"/>Em Progresso</label>
              <label><input type="radio" name="radio" onChange={e => setStatus(e.target.value)} checked={status === 'Concluído'} value="Concluído" className="input-r"/>Concluído</label>
            </div>
          </label>

          <label><span>Descrição</span>
            <textarea type="text" rows="6" value={descricao} onChange={e => setDescricao(e.target.value)} className="text-a"/>
          </label>

          <button className="btn-secondary" type="submit">Registrar</button>
        </form>
      </div>
    </div>
  )
}