import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { socket } from "../..";
import classes from "./RoomChat.module.css";
import ReactScollableFeed from "react-scrollable-feed";

export default function RoomChat(props) {
  const { userName } = props;
  const joinedRoomData = props.joinedRoomData;
  const { roomId } = joinedRoomData;
  const [messages, setMessages] = useState(props.joinedRoomData.messages);
  const [typedMessage, setTypedMessage] = useState("");
  const [members, setMembers] = useState(props.joinedRoomData.members);

  const onTypedMessageChanged = function (event) {
    setTypedMessage(event.target.value);
  };

  useEffect(() => {
    socket.on("recieve message", ({ message, sender }) => {
      setMessages((oldMessages) => [...oldMessages, { message, sender }]);
    });

    socket.on("update active users", ({ updatedMembers }) => {
      console.log("hi");
      setMembers(updatedMembers);
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
  };

  return (
    <div className={classes.roomContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.activeUsersContainer}>
          <h2>Active users</h2>
          <ReactScollableFeed>
            <ul className={classes.activeUsersList}>
              {members.map((member) => (
                <li className={classes.activeUsersListMember} key={v4()}>
                  {member}
                </li>
              ))}
            </ul>
          </ReactScollableFeed>
        </div>
        <div className={classes.chatContainer}>
          <div className={classes.actualContainer}>
            <ul className={classes.messageList}>
              <ReactScollableFeed>
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
              </ReactScollableFeed>
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
