import { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { getDocs, query, orderBy, collection } from 'firebase/firestore';
import connection from '../../service/firebaseConnection';

import './Dashboard.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import ModalCall from '../../components/Modais/ModalCall';

import { Link } from 'react-router-dom';

function Dashboard() {

  const [ calls, setCalls] = useState([]);
  const [ loading, setLoading] = useState(true);

  const [ modalOpen, setModalOpen] = useState(false);
  const [ contentModal, setContentModal] = useState();

  const QUERY = query(collection(connection, 'calls'), orderBy('createdAt', 'desc'));

  useEffect(() => {
    loadCalls();
  }, []);

  async function loadCalls() {
    setLoading(true);

    await getDocs(QUERY)
    .then(result => {
      if (result.size === 0) {
        toast.info('Nenhum chamado encontrado.');
        setCalls([]);
        return;
      } 

      let data = result.docs.map(doc => {
        return {
          id: doc.id,
          createdAtForm: format(doc.data().createdAt.toDate(), 'dd/MM/yyyy'),
          ...doc.data()
        }
      });
      
      setCalls(data);
      setLoading(false);
    })
    .catch((erro) => {
      setLoading(false);
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
      setCalls([]);
    });
  }

  function verificaStyleStatus(status) {
    switch (status) {
      case 'Aberto':
        return 'aberto';
  
      case 'Concluído':
        return 'concluido';
  
      case 'Em Progresso':
        return 'progresso';
    
      default:
        return '';
    }
  }

  function toggleModalCall(call) {
    setContentModal(call);
    setModalOpen(!modalOpen);
  }

  return (
    <div className="wrap">
      {modalOpen ? <ModalCall call={contentModal} toggleModalCall={toggleModalCall}/> : <></>}
      <Header />
      <div className="subwrap">
        <Title><i class="fas fa-phone-square-alt"></i>Chamados</Title>
        <div class="subwrapHeader">
          {calls.length <= 0 ? (
            <>
              <span>Nenhum chamado registrado.</span>
              <Link className="btn-primary" to="/new">Novo Chamado</Link>
            </>
          ) : (
            <Link className="btn-primary" to="/new">Novo Chamado</Link>
          )}
        </div>
        {loading ? (
          <span>carregando...</span>
        ) : (
          <div className="flow">
            <table>
              <thead>
                <tr className="thead">
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Cadastrado Em</th>
                </tr>
              </thead>
              <tbody>
              {calls.map((call, index) => (
                <tr key={call.id} onClick={() => toggleModalCall(call)}>
                  <td>{(index + 1)}</td>
                  <td>{call.cliente}</td>
                  <td>{call.assunto}</td>
                  <td><span className={'stts stts_'+verificaStyleStatus(call.status)}>{call.status}</span></td>
                  <td>{call.createdAtForm}</td>
                </tr>
              )
              )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;