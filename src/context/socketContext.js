// user/current user/current client/user are same here.
// joined room is active room

import { useToast } from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import { v4 } from "uuid";
import { AuthContext } from "./authcontext";
import { NOTIFICATION } from "../App";

export const socket = io("https://baatein-server-byashish.herokuapp.com/");

export const SocketContext = React.createContext({
  createRoom: () => {},
  joinRoom: () => {},
  closeRoomCreatedModal: () => {},
  isAlreadyRoomMember: () => {},
  notifyOtherUser: () => {},
  sendRoomMessage: () => {},
  isShowRoomCreatedModal: false,
  generatedRoomId: null,
});

const SocketContextProvider = function (props) {
  // must be true when new room is successfully created so that current user can be notified with modal displaying room id and let current user save it if user wants, false otherwise.
  const [isShowRoomCreatedModal, setIsShowRoomCreatedModal] = useState(false);

  // must be qual to room id which is generated or which is mentioned in the url [:roomid] part.
  const [generatedRoomId, setGeneratedRoomId] = useState(null);

  // it's 'current' property will store refrence to toast component.
  const toastIdRef = useRef();

  // toast component.
  const toast = useToast();

  const [isPreviousRoomJoined, setIsPreviousRoomJoined] = useState(false);

  const {
    storeSocketId,
    currentUserDetails,
    upDateUserData,
    updateCurrentUsersDetails,
    registerRoomOnDatabase,
    addNewMemberToRoom,
    updateActiveRoomMembers,
    updateActiveRoomMessages,
    isCurrentUserSocketUpdated,
    addNewMessageToRoom,
    updateCurrentUsersFriendRequetsRecieved,
    updateCurrentUsersFriendRequetsSent,
    updateCurrentUsersFriends,
    updateActivePersonalChatData,
  } = useContext(AuthContext);

  // function for closing taost, as this function will be treated as dependency, so to prevent infinite render, useCallback() id used.
  const close = useCallback(
    function () {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    },
    [toastIdRef, toast]
  );

  // useEffect for adding callback/event handlers to socket.
  useEffect(() => {
    // event emitted by server for storing socket id given by server.
    socket.on("store socket id", ({ socketId }) => {
      storeSocketId(socketId);
    });

    // event emitted by server when room is created
    socket.on("room created", ({ newRoomId }) => {
      setGeneratedRoomId(newRoomId);
      setIsShowRoomCreatedModal(true);
    });

    // event emitted by server when entered room id is valid or room actually exists then client is allowed to joined.
    socket.on("room joined", ({ roomId }) => {
      close();
      toastIdRef.current = toast({
        title: `room joined with room Id ${roomId}`,
        description: "navigate to messenger",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });

    // event emitted by server when client enters invalid room id, hence server denied the request of client to join room
    socket.on("can not join", ({ reason }) => {
      close();
      toastIdRef.current = toast({
        title: "error",
        description: reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });

    // server emits this event when new user joines thw room in which current user is also a member.
    socket.on("new user joined", ({ userName }) => {
      updateActiveRoomMembers(userName);
    });

    socket.on(
      "new notification",
      ({ title, description, payload, isSilent }) => {
        close();
        if (!isSilent)
          toastIdRef.current = toast({
            title,
            description,
            status: "info",
            duration: 10000,
            isClosable: true,
          });

        if (title === NOTIFICATION[0]) {
          updateCurrentUsersFriendRequetsRecieved({ payload, type: "ADD" });
        } else if (title === NOTIFICATION[1]) {
          updateCurrentUsersFriendRequetsRecieved({ payload, type: "DELETE" });
        } else if (title === NOTIFICATION[2]) {
          updateCurrentUsersFriendRequetsSent({ payload, type: "DELETE" });
          updateCurrentUsersFriends({ payload, type: "ADD" });
        } else if (title === NOTIFICATION[3]) {
          updateCurrentUsersFriendRequetsSent({ payload, type: "DELETE" });
        } else if (title === NOTIFICATION[4]) {
          updateActivePersonalChatData({ newMessage: payload });
        }
      }
    );

    // when some memmber of room sends message, server informs other members to recieve that message
    socket.on(
      "store new room message",
      ({ sender, senderEmail, message, roomId, date, time }) => {
        updateActiveRoomMessages({
          sender,
          senderEmail,
          message,
          roomId,
          date,
          time,
        });
      }
    );
  }, [
    close,
    toast,
    updateActiveRoomMessages,
    updateActiveRoomMembers,
    storeSocketId,
  ]);

  // function to create room
  const createRoom = function () {
    const newRoomId = v4();

    setGeneratedRoomId(newRoomId);

    registerRoomOnDatabase({
      roomId: newRoomId,
      messages: [],
      members: [currentUserDetails.userName],
      createdBy: currentUserDetails.userName,
      roomName: `${currentUserDetails.userName}'s room'`,
    });

    socket.emit("create room", {
      newRoomId,
      clientId: currentUserDetails.clientId,
    });

    const updatedRooms = [
      ...currentUserDetails.rooms,
      {
        roomName: `${currentUserDetails.userName}'s room`,
        roomId: newRoomId,
        createdBy: currentUserDetails.userName,
      },
    ];
    upDateUserData(currentUserDetails.FirebaseId, {
      rooms: updatedRooms,
    });
    updateCurrentUsersDetails({
      ...currentUserDetails,
      rooms: updatedRooms,
    });
  };

  // checks if current user is already a member of room with roomId = {roomId}
  const isAlreadyRoomMember = function (roomId) {
    return currentUserDetails.rooms.some(
      (roomData) => roomData.roomId === roomId
    );
  };

  // function to join current user to room with roomId = {roomId}
  const joinRoom = function ({ roomId, userName, clientId }) {
    socket.emit("join room", { roomId, userName, clientId });
    addNewMemberToRoom({ roomId, userName });
  };

  // function for sending messages to roomwith roomId = {roomId}
  const sendRoomMessage = function ({
    roomId,
    sender,
    senderEmail,
    message,
    date,
    time,
  }) {
    updateActiveRoomMessages({
      roomId,
      sender,
      senderEmail,
      message,
      date,
      time,
    });
    socket.emit("new room message", {
      roomId,
      sender,
      senderEmail,
      message,
      date,
      time,
    });
    addNewMessageToRoom({ roomId, sender, senderEmail, message, date, time });
  };

  const notifyOtherUser = function (
    recieverSocketID,
    { title, description, payload, isSilent }
  ) {
    socket.emit("notify", {
      recieverSocketID,
      title,
      description,
      payload,
      isSilent,
    });
  };

  const closeRoomCreatedModal = function () {
    setIsShowRoomCreatedModal(false);
    close();
  };

  // always requests server to join current user to all rooms which he/she had joined earlier with different/old socket id. current user always gets new socket id on login/page refresh, so it is compulsary to inform server about tthis and to update socket history.
  useEffect(() => {
    if (
      currentUserDetails &&
      isCurrentUserSocketUpdated === true &&
      isPreviousRoomJoined === false
    ) {
      socket.emit("have i joined any room", {
        clientId: currentUserDetails.clientId,
      });
      setIsPreviousRoomJoined(true);
    }
  }, [isCurrentUserSocketUpdated, isPreviousRoomJoined]);

  return (
    <SocketContext.Provider
      value={{
        createRoom,
        joinRoom,
        closeRoomCreatedModal,
        isAlreadyRoomMember,
        notifyOtherUser,
        generatedRoomId,
        isShowRoomCreatedModal,
        sendRoomMessage,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
