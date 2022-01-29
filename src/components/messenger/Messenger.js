import React from "react";
import classes from "./Messenger.module.css";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router";
import { Button } from "@chakra-ui/button";

export default function Messenger() {
  const { currentUserDetails, storeActiveFriendData } = useAuth();
  const navigate = useNavigate();

  const joinRoomChat = function (roomId) {
    navigate(`/home-page/messenger-page/roomChat/${roomId}`);
  };

  const joinPersonalChat = function (friendData) {
    storeActiveFriendData(friendData);
    navigate(`/home-page/messenger-page/personalChat/${friendData.chatId}`);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <h2 className={classes.listHeading}>friends</h2>
        <ul className={classes.list}>
          {currentUserDetails.friends.length === 0 && (
            <h2
              style={{ marginLeft: "auto", marginRight: "auto", color: "grey" }}
            >
              no friends
            </h2>
          )}
          {currentUserDetails.friends.length !== 0 &&
            currentUserDetails.friends.map((friend) => (
              <li className={classes.card} key={friend.FirebaseId}>
                <img
                  className={classes.profilePic}
                  alt={`${friend.userName} profile pic`}
                  src="/images/unnamed.jpg"
                />
                <h2>{`userName = ${friend.userName}`}</h2>
                <p>{`email = ${friend.email}`}</p>
                <div className={classes.btnContainer}>
                  <Button
                    onClick={joinPersonalChat.bind(this, friend)}
                    style={{ width: "80px" }}
                    colorScheme="blue"
                  >
                    chat
                  </Button>
                  <Button colorScheme="blue" style={{ width: "80px" }}>
                    profile
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className={classes.container}>
        <h2 className={classes.listHeading}>rooms</h2>
        <ul className={classes.list}>
          {currentUserDetails.rooms.length === 0 && (
            <h2
              style={{ marginLeft: "auto", marginRight: "auto", color: "grey" }}
            >
              no friends
            </h2>
          )}
          {currentUserDetails.rooms.length !== 0 &&
            currentUserDetails.rooms.map((room) => (
              <li className={classes.card} key={room.roomId}>
                <img
                  className={classes.profilePic}
                  alt={`${room.roomId} profile pic`}
                  src="/images/R.png"
                />
                <h2>{`room name = ${room.roomName}`}</h2>
                <p>{`room id= ${room.roomId}`}</p>
                <div className={classes.btnContainer}>
                  <Button
                    onClick={joinRoomChat.bind(this, room.roomId)}
                    style={{ width: "120px" }}
                    colorScheme="blue"
                  >
                    join chat
                  </Button>
                  <Button colorScheme="blue" style={{ width: "120px" }}>
                    room profile
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
