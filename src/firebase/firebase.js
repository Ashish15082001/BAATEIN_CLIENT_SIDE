import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtq5MaEJQQXR6cMNzFZnQHK50AJzeVguY",
  authDomain: "baatein-testing.firebaseapp.com",
  projectId: "baatein-testing",
  storageBucket: "baatein-testing.appspot.com",
  messagingSenderId: "626274925739",
  appId: "1:626274925739:web:2a9c121b7b7483e6918bee",
  measurementId: "G-39S2FSG46L",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
