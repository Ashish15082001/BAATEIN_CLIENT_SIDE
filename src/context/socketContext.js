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
export const socket = io("http://localhost:8000");

export const SocketContext = React.createContext({
  createRoom: () => {},
  joinRoom: () => {},
  closeRoomCreatedModal: () => {},
  sendMessage: () => {},
  isCreatingRoom: false,
  isJoiningRoom: false,
  isShowRoomCreatedModal: false,
  generatedRoomId: null,
  isRoomJoined: null,
  joinedRoomData: null,
  messages: [],
  roomMembers: [],
  ActiveRoomId: null,
});

const SocketContextProvider = function (props) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  // const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isShowRoomCreatedModal, setIsShowRoomCreatedModal] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState(null);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [joinedRoomData, setJoinedRoomData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const toastIdRef = useRef();
  const toast = useToast();
  const authContext = useContext(AuthContext);
  const userName = authContext.currentUser?.email;

  const close = useCallback(
    function () {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    },
    [toastIdRef, toast]
  );

  useEffect(() => {
    socket.on("room created", ({ newRoomId }) => {
      setIsCreatingRoom(false);
      // setIsRoomCreated(true);
      setIsShowRoomCreatedModal(true);
      setGeneratedRoomId(newRoomId);
      setIsShowRoomCreatedModal(true);
    });

    socket.on("room joined", ({ roomData }) => {
      setIsJoiningRoom(false);
      setJoinedRoomData(roomData);
      setRoomMembers(roomData.members);
      setActiveRoomId(roomData.roomId);
      setIsRoomJoined(true);
      setMessages(roomData.messages);

      close();
      toastIdRef.current = toast({
        description: "room joined successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });

    socket.on("can not join", ({ reason }) => {
      close();
      setIsJoiningRoom(false);
      toastIdRef.current = toast({
        title: "error",
        description: reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });

    socket.on("recieve message", ({ message, sender }) => {
      setMessages((oldMessages) => [...oldMessages, { message, sender }]);
    });

    socket.on("update active users", ({ updatedMembers }) => {
      setRoomMembers(updatedMembers);
    });
  }, [close, toast]);

  const createRoom = function () {
    setIsCreatingRoom(true);

    const newRoomId = v4();

    setGeneratedRoomId(newRoomId);
    socket.emit("create room", { newRoomId, userName });
  };

  const joinRoom = function (roomId) {
    close();
    if (roomId === "") {
      toastIdRef.current = toast({
        title: "Alert",
        description: "please enter room id",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setIsJoiningRoom(true);
    setJoinedRoomData(null);
    setIsRoomJoined(false);

    socket.emit("join room", { roomId, userName });
  };

  const sendMessage = function (message) {
    socket.emit("send message", {
      roomId: activeRoomId,
      sender: userName,
      message,
    });

    setMessages((oldMessages) => {
      return [...oldMessages, { message, sender: userName }];
    });
  };

  const closeRoomCreatedModal = function (toast) {
    setIsShowRoomCreatedModal(false);
    close();
  };

  return (
    <SocketContext.Provider
      value={{
        createRoom,
        joinRoom,
        closeRoomCreatedModal,
        isCreatingRoom,
        isJoiningRoom,
        generatedRoomId,
        isShowRoomCreatedModal,
        isRoomJoined,
        joinedRoomData,
        sendMessage,
        messages,
        roomMembers,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
