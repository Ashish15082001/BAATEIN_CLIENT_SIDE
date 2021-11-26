import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import classes from "./RoomChat.module.css";
import ReactScollableFeed from "react-scrollable-feed";
import { SocketContext } from "../../context/socketContext";
import { AuthContext } from "../../context/authcontext";

export default function RoomChat() {
  const [typedMessage, setTypedMessage] = useState("");
  const { sendMessage, messages, roomMembers } = useContext(SocketContext);
  const authContext = useContext(AuthContext);
  const userName = authContext.currentUserDetails?.userName;

  const onTypedMessageChanged = function (event) {
    setTypedMessage(event.target.value);
  };

  const onSendMessage = function () {
    if (typedMessage === "") return;

    sendMessage(typedMessage);
    setTypedMessage("");
  };

  return (
    <div className={classes.roomContainer}>
      <div className={classes.mainContainer}>
        {/* <ReactScollableFeed> */}
        <div className={classes.activeUsersContainer}>
          <h2 className={classes.activeUsersHeading}>
            Members
            <sup>{roomMembers.length}</sup>
          </h2>

          <ul className={classes.activeUsersList}>
            {roomMembers.map((member) => (
              <li className={classes.activeUsersListMember} key={v4()}>
                {member}
              </li>
            ))}
          </ul>
        </div>
        {/* </ReactScollableFeed> */}
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
                        ~
                        {userName === messageItem.sender
                          ? "you"
                          : messageItem.sender}
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
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
