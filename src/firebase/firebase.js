import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjqbucwywSaWlPnIUEv7u_NCWs7-d9ioE",
  authDomain: "baatien-testing-1b11c.firebaseapp.com",
  projectId: "baatien-testing-1b11c",
  storageBucket: "baatien-testing-1b11c.appspot.com",
  messagingSenderId: "1095391206363",
  appId: "1:1095391206363:web:a7cb8180211a64d029e5fe",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
