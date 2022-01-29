import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/authcontext";
import LoginForm from "./components/form/LoginForm";
import HomePage from "./pages/HomePage";
import SignupForm from "./components/form/SignupForm";
import RoomSelectionPage from "./pages/RoomSelectionPage";
import RoomWithIdPage from "./pages/RoomWithIdPage";
import AddFriendsPage from "./pages/AddFriendsPage";
import MessengerPage from "./pages/MessengerPage";
import RoomChat from "./components/roomChat/RoomChat";
import PersonalChat from "./components/personalChat/PersonalChat";

export default function AppRouter() {
  const { currentUserDetails } = useAuth();

  // console.log('inside approuter')

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUserDetails ? (
            <Navigate replace to="/home-page" />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page"
        element={
          currentUserDetails ? <HomePage /> : <Navigate replace to="/login" />
        }
      ></Route>
      <Route
        path="/signup"
        element={
          currentUserDetails ? (
            <Navigate replace to="/home-page" />
          ) : (
            <SignupForm />
          )
        }
      ></Route>
      <Route
        path="/login"
        element={
          currentUserDetails ? (
            <Navigate replace to="/home-page" />
          ) : (
            <LoginForm />
          )
        }
      ></Route>
      <Route
        path="/home-page/room"
        element={
          currentUserDetails ? (
            <RoomSelectionPage />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page/room/:roomId"
        element={
          currentUserDetails ? (
            <RoomWithIdPage />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page/add-friends"
        element={
          currentUserDetails ? (
            <AddFriendsPage />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page/messenger-page"
        element={
          currentUserDetails ? (
            <MessengerPage />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
      <Route
        path="/home-page/messenger-page/roomChat/:roomId"
        element={
          currentUserDetails ? <RoomChat /> : <Navigate replace to="/login" />
        }
      ></Route>
      <Route
        path="/home-page/messenger-page/personalChat/:chatId"
        element={
          currentUserDetails ? (
            <PersonalChat />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      ></Route>
    </Routes>
  );
}
