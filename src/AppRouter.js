import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/authcontext";
import LoginForm from "./components/form/LoginForm";
import HomePage from "./pages/HomePage";
import SignupForm from "./components/form/SignupForm";
import RoomSelectionPage from "./pages/RoomSelectionPage";

export default function AppRouter() {
  const { currentUser } = useAuth();

  console.log(currentUser);

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate replace to="/home-page" />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page"
        element={currentUser ? <HomePage /> : <Navigate replace to="/login" />}
      ></Route>
      <Route
        path="/signup"
        element={
          currentUser ? <Navigate replace to="/home-page" /> : <SignupForm />
        }
      ></Route>
      <Route
        path="/login"
        element={
          currentUser ? <Navigate replace to="/home-page" /> : <LoginForm />
        }
      ></Route>
      <Route
        path="/home-page/room"
        element={
          currentUser ? <RoomSelectionPage /> : <Navigate replace to="/login" />
        }
      ></Route>
    </Routes>
  );
}
