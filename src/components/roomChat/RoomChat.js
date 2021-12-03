import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import classes from "./RoomChat.module.css";
import ReactScollableFeed from "react-scrollable-feed";
import { useParams } from "react-router";
import { useAuth } from "../../context/authcontext";
import { SocketContext } from "../../context/socketContext";

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

    sendRoomMessage({
      message: typedMessage,
      sender: currentUserDetails.userName,
      roomId,
    });
    setTypedMessage("");
  };

  if (activeRoomData) {
    const { messages, members: roomMembers } = activeRoomData;
    const { userName } = currentUserDetails;
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
