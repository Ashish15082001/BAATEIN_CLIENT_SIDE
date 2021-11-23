import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "@firebase/auth";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { auth } from "../firebase/firebase";

export const AuthContext = React.createContext({
  currentUser: null,
  upDateUserData: () => {},
  register: () => {},
  signIn: () => {},
  signout: () => {},
  forgotPassword: () => {},
});

export const useAuth = () => useContext(AuthContext);

const ContextProvider = function (props) {
  const [currentUser, setCurrentUser] = useState(null);

  // console.log(currentUser);

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubsribe();
  }, []);

  const register = function (email, passsword) {
    return createUserWithEmailAndPassword(auth, email, passsword);
  };
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
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
