import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
// import { addDoc, collection } from "@firebase/firestore";

import React, { useState } from "react";
import { auth, db } from "../components/firebase/App";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
} from "@firebase/firestore";

export const AuthContext = React.createContext({
  currentUser: null,
  userData: null,
  upDateUserData: () => {},
  signup: () => {},
  login: () => {},
  logout: () => {},
});

const ContextProvider = function (props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const usersCollection = collection(db, "users");

  console.log(currentUser, userData);

  const nextOrObserver = function (currentUser) {
    setCurrentUser(currentUser);
  };

  const upDateUserData = function (dataObject) {
    setUserData(dataObject);
  };

  const error = function (err) {
    alert(err.message);
  };

  onAuthStateChanged(auth, nextOrObserver, error);

  const signup = async function (email, userName, passsword) {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        passsword
      );

      addDoc(usersCollection, { email, userName });
      setUserData({ userName });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const login = async function (email, passsword) {
    try {
      const response = await signInWithEmailAndPassword(auth, email, passsword);

      const myQuery = query(usersCollection, where("email", "==", email));
      console.log("hi");
      const firestoreResponse = await getDocs(myQuery);
      const targetData = firestoreResponse.docs;

      const actualData = targetData.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(actualData);
      setUserData({ userName: actualData[0].userName });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async function () {
    await signOut(auth);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{ userData, currentUser, upDateUserData, signup, login, logout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
