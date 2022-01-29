import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import classes from "./RoomChat.module.css";
import ReactScollableFeed from "react-scrollable-feed";
import { useParams } from "react-router";
import { useAuth } from "../../context/authcontext";
import { SocketContext } from "../../context/socketContext";
import {
  getCurrentDateString,
  getCurrentTimeString,
} from "../utility/helperFunctions";

export default function RoomChat() {
  const { getRoomData, setActiveRooData, activeRoomData, currentUserDetails } =
    useAuth();

  const [typedMessage, setTypedMessage] = useState("");
  const { roomId } = useParams();
  const { sendRoomMessage } = useContext(SocketContext);

  useEffect(() => {
    const updateActiveRoomData = async function () {
      const activeRoomData = await getRoomData(roomId);
      setActiveRooData(activeRoomData);
    };

    updateActiveRoomData();

    return () => setActiveRooData(null);
  }, [getRoomData, setActiveRooData, roomId]);

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

    sendRoomMessage({
      message: typedMessage,
      sender: currentUserDetails.userName,
      roomId,
      senderEmail: currentUserDetails.email,
      date: dateString,
      time: timeString,
    });
    setTypedMessage("");
  };

  if (activeRoomData) {
    const { messages, members: roomMembers } = activeRoomData;
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
                <ReactScollableFeed className={classes.chatScroll}>
                  {messages.map((messageItem, index, messages) => (
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
                        messages[index - 1].date !== messages[index].date) && (
                        <p className={classes.messageDate}>
                          {getCurrentDateString() === messageItem.date
                            ? "today"
                            : messageItem.date}
                        </p>
                      )}
                      <div
                        className={
                          classes[
                            currentUserDetails.email === messageItem.senderEmail
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
                        <p>
                          {index === 0 && (
                            <span className={classes.messageSender}>
                              ~{messageItem.sender}
                              <br></br>
                            </span>
                          )}
                          {index !== 0 &&
                            messages[index].sender !==
                              messages[index - 1].sender && (
                              <span className={classes.messageSender}>
                                ~{messageItem.sender}
                                <br></br>
                              </span>
                            )}
                          {messageItem.message}
                        </p>

                        <p className={classes.messageTime}>
                          {messageItem.time}
                        </p>
                      </div>
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

  return <h1>room chat</h1>;
}
