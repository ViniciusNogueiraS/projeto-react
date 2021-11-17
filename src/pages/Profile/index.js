import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref , uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import connection from '../../service/firebaseConnection';

import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import avatar from '../../assets/imgs/user_icon.png';
import './Profile.css';

export default function Profile() {

  const { user, setUser, saveUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user.nome);
  const [email] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  function handleFile(e) {
    console.log(e.target.files[0]);

    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      }else{
        setImageAvatar(null);
        return;
      }
    }
  }

  async function upload() {
    const rootRef = ref(getStorage());
    const userRef = ref(rootRef, user.id);
    const imagesRef = ref(rootRef, imageAvatar.name);
    const avatarRef = ref(rootRef, `images/${user.id}/${imageAvatar.name}`);

    const metada = {
      contentType: imageAvatar.type
    }

    const uploadTask = uploadBytesResumable(avatarRef, imageAvatar, metada);
    uploadTask.on('state-changed', async () => {
      await getDownloadURL(avatarRef)
      .then( async (url) => {

        await setDoc(doc(connection, 'users', user.id), {
          nome: nome,
          avatarUrl: url
        })
        .then(() => {
          let data = {
            ...user,
            avatarUrl: url,
            nome: nome
          }
          setUser(data);
          saveUser(data);

          toast.success('Perfil atualizado!');
        })
        .catch((erro) => {
          toast.error('Ops! Algo deu errado.');
          console.log(erro);
        });
      })
      .catch(erro => {
        toast.error('Ops! Algo deu errado.');
        console.log(erro);
      });
    }, (erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
    });
  }
  
  async function salvar(e) {
    e.preventDefault();

    if (nome !== user.nome || avatarUrl !== user.avatarUrl) {
      await setDoc(doc(connection, 'users', user.id), {
        nome: nome
      })
      .then(() => {
        let data = {
          ...user,
          nome: nome
        }

        setUser(data);
        saveUser(data);

        toast.success('Usuário atualizado!');
      })
      .catch((erro) => {
        toast.error('Ops! Algo deu errado.');
        console.log(erro);
      });

      if (avatarUrl != user.avatarUrl) upload();
    }else {
      toast.info('Não houve alterações!');
    }
  }

  return (
    <div className="wrap">
      <Header/>
      <div className="subwrap">
        <Title><i class="fas fa-cogs"></i>Configurações</Title>
        <form onSubmit={salvar} className="form-1">
          <label><span>Avatar</span>
            {avatarUrl === null ?
              <img src={avatar} className="avatar" width="70" height="70"/>
              :
              <img src={avatarUrl} className="avatar" width="70" height="70"/>
            }
            <span><i class="fas fa-upload"/></span>
            <input type="file" className="input-t" accept="image/*" onChange={handleFile}/>
          </label>
          <label><span>Nome</span>
            <input type="text" className="input-t" value={nome} onChange={e => setNome(e.target.value)}/>
          </label>
          <label><span>Email</span>
            <input type="text" className="input-t" value={email} disabled/>
          </label>

          <button className="btn-secondary" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  )
}