import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { socket } from "../..";
import classes from "./RoomChat.module.css";

export default function RoomChat(props) {
  const { userName } = props;
  const joinedRoomData = props.joinedRoomData;
  const { roomId, members } = joinedRoomData;
  const [messages, setMessages] = useState(props.joinedRoomData.messages);
  const [typedMessage, setTypedMessage] = useState("");
  const chatListRef = useRef(null);

  const onTypedMessageChanged = function (event) {
    setTypedMessage(event.target.value);
  };

  useEffect(() => {
    socket.on("recieve message", ({ message, sender }) => {
      setMessages((oldMessages) => [...oldMessages, { message, sender }]);
    });
  }, []);

  const onSendMessage = function () {
    if (typedMessage === "") return;

    socket.emit("send message", {
      roomId,
      sender: userName,
      message: typedMessage,
    });
    setMessages((oldMessages) => {
      return [...oldMessages, { message: typedMessage, sender: userName }];
    });
    setTypedMessage("");
    chatListRef.current.scrollBy(0, 1000);
  };

  return (
    <div className={classes.roomContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.activeUsersContainer}>
          <h2>Active users</h2>
          <ul className={classes.activeUsersList}>
            {members.map((member) => (
              <li key={v4()}>{member}</li>
            ))}
          </ul>
        </div>
        <div className={classes.chatContainer}>
          <div className={classes.actualContainer}>
            <ul ref={chatListRef} className={classes.messageList}>
              {messages.map((messageItem) => (
                <li
                  className={
                    classes[
                      userName === messageItem.sender
                        ? "selfMessage"
                        : "othersMessage"
                    ]
                  }
                  key={v4()}
                >
                  <p
                    className={
                      classes[
                        userName === messageItem.sender
                          ? "selfActualMessage"
                          : "othesrActualMessage"
                      ]
                    }
                  >
                    {messageItem.message}
                    <span className={classes.messageSenderName}>
                      ~{messageItem.sender}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.chatContainerBottom}>
            <Input
              className={classes.input}
              value={typedMessage}
              onChange={onTypedMessageChanged}
              placeholder="type"
            ></Input>
            <Button onClick={onSendMessage} colorScheme="teal">
              Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
