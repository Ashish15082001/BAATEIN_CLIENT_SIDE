import React from "react";
import LoginForm from "../components/form/LoginForm";
import io from "socket.io-client";

export const socket = io("http://localhost:8000");

export const DATABASE_URL =
  "https://baatein-chat-app-default-rtdb.firebaseio.com/";

export default function Home() {
  return <LoginForm />;
}
