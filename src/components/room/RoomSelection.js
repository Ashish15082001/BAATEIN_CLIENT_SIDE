import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useCallback, useContext, useRef, useState } from "react";
import { SocketContext } from "../../context/socketContext";
import classes from "./RoomSelection.module.css";
import RoomCreatedModal from "../modals/RoomCreatedModal";
import AlreadyRoomMemberModal from "../modals/AlreadyRoomMemberModal";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "../../context/authcontext";

export default function RoomSelection() {
  const [roomId, setRoomId] = useState("");
  const [isShowAlreadyRoomMemberModal, setIsShowAlreadyRoomMemberModal] =
    useState(false);
  const toastIdRef = useRef();
  const toast = useToast();
  const {
    createRoom,
    isCreatingRoom,
    isJoiningRoom,
    isShowRoomCreatedModal,
    generatedRoomId,
    closeRoomCreatedModal,
    isAlreadyRoomMember,
    joinRoom,
  } = useContext(SocketContext);
  const { currentUserDetails } = useAuth();

  const close = useCallback(
    function () {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
    },
    [toastIdRef, toast]
  );

  const onRoomIdChange = function (event) {
    setRoomId(event.target.value);
  };

  const onCreateRoom = function () {
    createRoom();
  };

  const onJoinRoom = function () {
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

    if (isAlreadyRoomMember(roomId)) {
      setIsShowAlreadyRoomMemberModal(true);
      return;
    }
    joinRoom({
      roomId,
      userName: currentUserDetails.userName,
      clientId: currentUserDetails.clientId,
    });
  };

  const oncloseIsShowAlreadyRoomMember = function () {
    setIsShowAlreadyRoomMemberModal(false);
  };
  const oncloseRoomCreatedModal = function () {
    closeRoomCreatedModal();
  };

  return (
    <React.Fragment>
      {isShowAlreadyRoomMemberModal && (
        <AlreadyRoomMemberModal
          isOpen={isShowAlreadyRoomMemberModal}
          onClose={oncloseIsShowAlreadyRoomMember}
        />
      )}

      {isShowRoomCreatedModal && (
        <RoomCreatedModal
          isOpen={isShowRoomCreatedModal}
          onClose={oncloseRoomCreatedModal}
          generatedRoomId={generatedRoomId}
        />
      )}

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
              click on <strong>Create room</strong> to Create new room id, then
              type that room id and click on join. you can send room id to
              people that you want to chat with. To join other rooms, Click on{" "}
              <strong>join room </strong>
              after typing room id.
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
