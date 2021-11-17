import { useState, createContext, useEffect } from 'react';
import { doc, setDoc, deleteDoc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import connection from '../service/firebaseConnection';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {

    function loadingUser() {
      const storageUser = window.localStorage.getItem('systemUser');

      if (storageUser) setUser(JSON.parse(storageUser));
      setLoading(false);
    }

    loadingUser();
  }, []);

  function saveUser(data) {
    window.localStorage.setItem('systemUser', JSON.stringify(data));
  }

  async function signIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(getAuth(), email, password)
    .then( async (result) => {
      let uid = result.user.uid;

      await getDoc(doc(connection, 'users', uid))
      .then((userProfile) => {
        let data = {
          id: uid,
          nome: userProfile.data().nome,
          email: result.user.email,
          avatarUrl: null
        }

        setUser(data);
        saveUser(data);
        setLoadingAuth(false);

        toast.success('Bem-vindo!');
      })
      .catch((erro) => {
        toast.error('Ops! Algo deu errado.');
        console.log(erro);
        setLoadingAuth(false);
      })
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
      setLoadingAuth(false);
    })
  }

  async function signUp(nome, email, senha) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(getAuth(), email, senha)
    .then( async (result) => {
      let uid = result.user.uid;

      await setDoc(doc(connection, 'users', uid), {
        nome: nome,
        avatarUrl: null
      })
      .then(() => {
        let data = {
          id: uid,
          nome: nome,
          email: result.user.email,
          avatarUrl: null
        }

        setUser(data);
        saveUser(data);
        setLoadingAuth(false);

        toast.success('Novo acesso criado com sucesso! Aproveite!');
      })
      .catch((erro) => {
        toast.error('Ops! Algo deu errado.');
        console.log(erro);
        setLoadingAuth(false);
      });
    })
    .catch((erro) => {
      toast.error('Ops! Algo deu errado.');
      console.log(erro);
      setLoadingAuth(false);
    });
  }

  async function logout() {
    await signOut(getAuth());
    window.localStorage.removeItem('systemUser');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{signed: !!user, user, setUser, saveUser, loading, loadingAuth, signUp, signIn, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;