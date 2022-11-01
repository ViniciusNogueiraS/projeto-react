import { useState, useEffect } from 'react';
import './Modal.css';

import Title from '../../components/Title';
import { Link } from 'react-router-dom';

export default function ModalCall(props) {

  const [ call, setCall] = useState(props.call);

  useEffect(() => {
    setCall(props.call);
    console.log(call)
  });

  function close() {
    props.toggleModalCall();
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

  return (
    <div className="modal-flow" onClick={() => close()}>
      <div className="modal">
        <button className="btn-close" onClick={() => close()}>X</button>
        <Title><i class="fas fa-phone-square-alt"></i>Chamado para {call.assunto}<span className={'stts stts_'+verificaStyleStatus(call.status)}>{call.status}</span></Title>
        <hr/>
        <small className="callId">ID: {call.id}</small>
        <div className="contentCall">
          <label>
            <b>Cliente:</b>
            <p>{call.cliente} ({call.clienteId})</p>
          </label>
          <label>
            <b>Criado em:</b>
            <p>{call.createdAtForm}</p>
          </label>
          <label>
            <b>Descrição:</b>
            <p>{call.descricao}</p>
          </label>
          <label>
            <b>Criado por:</b>
            <p>{call.userId}</p>
          </label>
        </div>
        <div>
          <button>Excluir</button>
          <Link className="btn-primary" to={'/new/'+call.id}>Editar</Link>
        </div>
      </div>
    </div>
  )
}