import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { socket } from "../..";
import { useAuth } from "../../context/authcontext";
import RoomCreatedModal from "../modals/RoomCreatedModal";
import RoomChat from "../roomChat.js/RoomChat";
import classes from "./RoomSelection.module.css";

export default function RoomSelection() {
  const [roomId, setRoomId] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const { currentUser } = useAuth();
  // const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isShowRoomCreatedModal, setIsShowRoomCreatedModal] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState();
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [joinedRoomData, setJoinedRoomData] = useState();
  const toastIdRef = useRef();
  const toast = useToast();
  const userName = currentUser.email;

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
      console.log("room created", newRoomId);
      setIsCreatingRoom(false);
      // setIsRoomCreated(true);
      setIsShowRoomCreatedModal(true);
      setGeneratedRoomId(newRoomId);
    });

    socket.on("room joined", ({ roomData }) => {
      setIsJoiningRoom(false);
      setJoinedRoomData(roomData);
      setIsRoomJoined(true);

      console.log(roomData);
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
        description: reason,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    });
  }, [close, toast]);

  const onRoomIdChange = function (event) {
    setRoomId(event.target.value);
  };

  const onCreateRoom = function () {
    setIsCreatingRoom(true);
    setGeneratedRoomId(undefined);
    const newRoomId = v4();

    socket.emit("create room", { newRoomId, userName });
  };

  const onJoinRoom = function () {
    close();
    if (roomId === "") {
      toastIdRef.current = toast({
        description: "please enter room id",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setIsJoiningRoom(true);

    socket.emit("join room", { roomId, userName });
  };

  const closeRoomCreatedModal = function () {
    setIsShowRoomCreatedModal(false);
  };

  const onSaveGeneratedRoomId = function () {
    close();
    setIsShowRoomCreatedModal(false);
    setRoomId(generatedRoomId);
    toastIdRef.current = toast({
      description: "new room id is copied.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <React.Fragment>
      {isRoomJoined && (
        <RoomChat joinedRoomData={joinedRoomData} userName={userName} />
      )}
      {!isRoomJoined && (
        <RoomCreatedModal
          isOpen={isShowRoomCreatedModal}
          onClose={closeRoomCreatedModal}
          generatedRoomId={generatedRoomId}
          onSaveGeneratedRoomId={onSaveGeneratedRoomId}
        />
      )}
      {!isRoomJoined && (
        <div className={classes.mainContainer}>
          <div className={classes.leftContainer}>
            <div className={classes.leftSubContainer}>
              <h1 className={classes.leftSubContainerHeading}>
                Real-time chattings. Now free for everyone.
              </h1>
              <p className={classes.leftSubContainerDescription}>
                {" "}
                We re-engineered the service that we built for secure bussiness,
                or personal meeting. Baatein Room, to make it free and available
                for all.
              </p>
              <div className={classes.leftSubContainerBtnInp}>
                <Input
                  value={roomId}
                  onChange={onRoomIdChange}
                  className={classes.input}
                  placeholder="Room Id"
                />
                <div className={classes.btnContainer}>
                  {" "}
                  <Button
                    isLoading={isCreatingRoom}
                    onClick={onCreateRoom}
                    loadingText="creating"
                    colorScheme="teal"
                    variant="solid"
                    className={classes.btn}
                  >
                    Create room
                  </Button>
                  <Button
                    onClick={onJoinRoom}
                    isLoading={isJoiningRoom}
                    loadingText="joining"
                    colorScheme="teal"
                    variant="solid"
                    className={classes.btn}
                  >
                    Join room
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.rightContainer}>
            <div className={classes.rightSubContainer}>
              <img
                alt="logo"
                className={classes.logo}
                src="/images/logo192.png"
              ></img>
              <p className={classes.rightSubContainerDescription}>
                {" "}
                click on <strong>Create room</strong> to Create new room id,
                then type that room id and click on join. you can send room id
                to people that you want to chat with. To join other rooms, Click
                on <strong>join room </strong>
                after typing room id.
              </p>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
