import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/socketContext";
import RoomChat from "../components/roomChat/RoomChat";

export default function RoomWithIdPage() {
  const params = useParams();
  const { joinRoom, isJoiningRoom, isRoomJoined } = useContext(SocketContext);
  //   console.log('hi');

  useEffect(() => {
    joinRoom(params.roomId);
  }, []);

  return (
    <div>
      {isJoiningRoom && !isRoomJoined && <p>joining room..</p>}
      {!isJoiningRoom && !isRoomJoined && <p>please check your room id</p>}
      {isRoomJoined && <RoomChat />}
    </div>
  );
}
