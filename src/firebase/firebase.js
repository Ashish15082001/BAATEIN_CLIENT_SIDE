import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXkBx3TZ6VUjDoOZokgFgSwTEnxn0oibY",
  authDomain: "baatein-chat-app.firebaseapp.com",
  databaseURL: "https://baatein-chat-app-default-rtdb.firebaseio.com",
  projectId: "baatein-chat-app",
  storageBucket: "baatein-chat-app.appspot.com",
  messagingSenderId: "16506485751",
  appId: "1:16506485751:web:458970b5ba9487d9940cf2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
