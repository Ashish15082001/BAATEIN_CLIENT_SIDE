import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import classes from "./PersonalChat.module.css";
import ReactScollableFeed from "react-scrollable-feed";
import { useParams } from "react-router";
import { useAuth } from "../../context/authcontext";
import { SocketContext } from "../../context/socketContext";
import { NOTIFICATION } from "../../App";
import {
  getCurrentDateString,
  getCurrentTimeString,
} from "../utility/helperFunctions";

export default function PersonalChat() {
  const [typedMessage, setTypedMessage] = useState("");
  const { chatId } = useParams();
  const { notifyOtherUser } = useContext(SocketContext);
  const {
    setActivePersonalChatData,
    currentUserDetails,
    activePersonalChat,
    activeFriendData,
    updateActivePersonalChatData,
    addNewMessageToPersonalChat,
  } = useAuth();

  useEffect(() => {
    setActivePersonalChatData(chatId);

    return () => {
      setActivePersonalChatData(null);
    };
  }, []);

  const onTypedMessageChanged = function (event) {
    setTypedMessage(event.target.value);
  };

  const onKeyPressed = function (event) {
    console.log(event.code);
    if (event.code === "Enter") {
      onSendMessage();
    }
  };

  const onSendMessage = function () {
    if (typedMessage === "") return;

    const dateString = getCurrentDateString();
    const timeString = getCurrentTimeString();

    console.log(dateString, timeString);

    const updatedPersonalChatMessages = [
      ...activePersonalChat.messages,
      {
        senderEmail: currentUserDetails.email,
        message: typedMessage,
        date: dateString,
        time: timeString,
      },
    ];

    console.log(updatedPersonalChatMessages);

    updateActivePersonalChatData({
      newMessage: {
        senderEmail: currentUserDetails.email,
        message: typedMessage,
        date: dateString,
        time: timeString,
        chatId: activePersonalChat.chatId,
      },
    });

    addNewMessageToPersonalChat(
      activePersonalChat.FirebaseId,
      updatedPersonalChatMessages
    );

    notifyOtherUser(activeFriendData.currentSocketId, {
      title: NOTIFICATION[4],
      description: null,
      payload: {
        senderEmail: currentUserDetails.email,
        message: typedMessage,
        date: dateString,
        time: timeString,
        chatId: activePersonalChat.chatId,
      },
      isSilent: true,
    });

    setTypedMessage("");
  };

  if (activePersonalChat) {
    return (
      <div className={classes.container}>
        <div className={classes.mainContainer}>
          <div className={classes.chatContainer}>
            <div className={classes.actualContainer}>
              <ul className={classes.messageList}>
                <ReactScollableFeed className={classes.chatScroll}>
                  {activePersonalChat.messages.map(
                    (messageItem, index, messages) => (
                      <li
                        className={
                          classes[
                            currentUserDetails.email === messageItem.senderEmail
                              ? "selfMessage"
                              : "othersMessage"
                          ]
                        }
                        key={v4()}
                      >
                        {(index === 0 ||
                          messages[index - 1].date !==
                            messages[index].date) && (
                          <p className={classes.messageDate}>
                            {getCurrentDateString() === messageItem.date
                              ? "today"
                              : messageItem.date}
                          </p>
                        )}
                        <div
                          className={
                            classes[
                              currentUserDetails.email ===
                              messageItem.senderEmail
                                ? "selfActualMessage"
                                : "othesrActualMessage"
                            ]
                          }
                          style={{
                            marginTop: `${
                              index === 0 ||
                              messages[index - 1].date !== messages[index].date
                                ? "4.5rem"
                                : 0
                            }`,
                          }}
                        >
                          <p>{messageItem.message}</p>
                          <p className={classes.messageTime}>
                            {messageItem.time}
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ReactScollableFeed>
              </ul>
            </div>
            <div className={classes.chatContainerBottom}>
              <Input
                className={classes.input}
                value={typedMessage}
                onChange={onTypedMessageChanged}
                placeholder="type"
                onKeyPress={onKeyPressed}
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

  return <h1>loading personal chat...</h1>;
}
