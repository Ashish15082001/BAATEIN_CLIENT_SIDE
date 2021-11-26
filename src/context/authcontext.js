import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "@firebase/auth";
import { addDoc, collection, getDocs, query, where } from "@firebase/firestore";
import React, { useCallback } from "react";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase/firebase";

export const AuthContext = React.createContext({
  currentUser: null,
  currentUserDetails: null,
  upDateUserData: () => {},
  register: () => {},
  signIn: () => {},
  signout: () => {},
  forgotPassword: () => {},
  registerUserOnDatabase: () => {},
});

export const useAuth = () => useContext(AuthContext);

const ContextProvider = function (props) {
  const [currentUser, setCurrentUser] = useState(null);
  const usersCollection = collection(db, "users");
  const [currentUserDetails, setCurrentUserDetails] = useState(null);

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      if (user) getCurrentUserDetails(user.email);
      else setCurrentUser(null);

      setCurrentUser(user);
    });
    return () => unsubsribe();
  }, [getCurrentUserDetails, setCurrentUser]);

  const register = function (email, passsword) {
    return createUserWithEmailAndPassword(auth, email, passsword);
  };

  const registerUserOnDatabase = function (email, userName) {
    return addDoc(usersCollection, { email, userName });
  };

  const getCurrentUserDetails = useCallback(async function (email) {
    const q = query(usersCollection, where("email", "==", email));
    let userDataDetails;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userDataDetails = doc.data();
    });
    setCurrentUserDetails(userDataDetails);
  }, []);

  const signIn = function (email, passsword) {
    return signInWithEmailAndPassword(auth, email, passsword);
  };

  const signout = function () {
    return signOut(auth);
  };

  const forgotPassword = function (email) {
    return sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login",
    });
  };

  const upDateUserData = function () {};

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        upDateUserData,
        register,
        signIn,
        signout,
        forgotPassword,
        registerUserOnDatabase,
        currentUserDetails,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
