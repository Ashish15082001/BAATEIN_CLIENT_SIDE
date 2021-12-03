import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcKL-vOaC4ReQDKveHEhLjd1gZwIeGy0M",
  authDomain: "baatien-testing.firebaseapp.com",
  projectId: "baatien-testing",
  storageBucket: "baatien-testing.appspot.com",
  messagingSenderId: "561535186072",
  appId: "1:561535186072:web:29bc5b7ab16dc81faa4ced",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
