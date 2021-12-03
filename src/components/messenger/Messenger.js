import React, { useContext } from "react";
import classes from "./Messenger.module.css";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router";
import { SocketContext } from "../../context/socketContext";

export default function Messenger() {
  const { currentUserDetails } = useAuth();
  const navigate = useNavigate();

  const joinRoomChat = function (roomId) {
    navigate(`/home-page/messenger-page/roomChat/${roomId}`);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.friendsContainer}>
        <ul className={classes.list}>
          {currentUserDetails.friends.map((friend) => (
            <li key={friend.FirebaseId}>
              <img
                className={classes.roomProfilePic}
                alt={`${friend.userName} profile pic`}
                src="/images/unnamed.jpg"
              />
              <h2>{friend.userName}</h2>
              <p>{friend.email}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={classes.roomsContainer}>
        <ul className={classes.list}>
          {currentUserDetails.rooms.map((room) => (
            <li
              onClick={joinRoomChat.bind(this, room.roomId)}
              className={classes.roomProfileCard}
              key={room.roomId}
            >
              <img
                className={classes.roomProfilePic}
                alt={`${room.roomId} profile pic`}
                src="/images/R.png"
              />
              <h2>{`room name = ${room.roomName}`}</h2>
              <p>{`room id= ${room.roomId}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
