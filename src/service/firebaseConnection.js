import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIMLp8KDzIwYk3bg30nKSw0L7cW5BHrfI",
  authDomain: "cursoreact-7b443.firebaseapp.com",
  projectId: "cursoreact-7b443",
  storageBucket: "cursoreact-7b443.appspot.com",
  messagingSenderId: "16230654220",
  appId: "1:16230654220:web:3f5fa931e40a6926e9a929",
  measurementId: "G-P9HYWCD2JV"
};

const connection = getFirestore(initializeApp(firebaseConfig));
 export default connection;

 //export const collectionUsers = collection(connection, 'users');