import React, { useEffect, useContext, useState, useRef } from "react";
import { v4 } from "uuid";
import { AuthContext } from "../../context/authcontext";
import { socket } from "../../pages";
import ActiveUsers from "./ActiveUsers";
import ChatList from "./ChatList";
import classes from "./Room.module.css";

export default function Room() {
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const context = useContext(AuthContext);
  const [typedMessage, setTypedMessage] = useState("");
  const [showChats, setShowChats] = useState(false);
  const [activeUsers, setActiveUsers] = useState([context.userData.userName]);

  useEffect(() => {
    socket.on("joined room", (messages) => {
      console.log(messages, messages.messages);
      if (messages.messages === 0) return;

      setMessages(messages.messages);
    });

    socket.on("recieved message", (messages) => {
      console.log("messages : ", messages);
      setMessages(messages.messages);
    });

    socket.on("update active users", (activeUsersObject) => {
      setActiveUsers(activeUsersObject.activeUsers);
    });
  }, []);

  const genrateRoomId = function (event) {
    event.preventDefault();
    setRoomId(v4().substring(0, 10));
  };

  const joinRoom = function (event) {
    event.preventDefault();

    socket.emit("join room", {
      roomId,
      userName: context.userData.userName,
    });

    setShowChats(true);
    context.upDateUserData({ ...context.userData, roomId });
  };

  const sendMessage = function () {
    if (typedMessage === "") return;

    socket.emit("text to room", {
      message: typedMessage,
      sender: context.userData.userName,
      roomId,
    });

    setTypedMessage("");
  };

  const updateRoomId = function (event) {
    setRoomId(event.target.value);
  };

  const updateTypedMessage = function (event) {
    setTypedMessage(event.target.value);
  };

  if (showChats) {
    return (
      <div className={classes.mainChatContainer}>
        <nav className={classes.chatHeader}>
          <h2 className={classes.leftHeading}>
            active users <sup>{activeUsers.length}</sup>
          </h2>
          <h2 className={classes.rigthHeading}>chats</h2>
        </nav>
        <div className={classes.chatContainer}>
          <div className={classes.activeUserSection}>
            <ActiveUsers
              self={context.userData.userName}
              activeUsers={activeUsers}
            />
          </div>
          <div className={classes.chatSection}>
            <div className={classes.chatDisplay}>
              <ChatList
                messages={messages}
                sender={context.userData.userName}
              />
            </div>
            <div className={classes.typingSection}>
              <input
                className={classes.typingBox}
                type="text"
                placeholder="type..."
                value={typedMessage}
                onChange={updateTypedMessage}
              ></input>
              <button onClick={sendMessage} className={classes.sendBtn}>
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.subContainer}>
        <div className={classes.div1}>
          <input
            className={classes.input}
            placeholder="room id"
            onChange={updateRoomId}
            required
            minLength="9"
          ></input>
          <button onClick={joinRoom} className={classes.btn}>
            join room
          </button>
        </div>
        <div className={classes.div2}>
          <p className={classes.p}>
            your room id is : <span>{roomId}</span>
          </p>
          <button onClick={genrateRoomId} className={classes.btn}>
            create room
          </button>
        </div>
      </div>
    </div>
  );
}
