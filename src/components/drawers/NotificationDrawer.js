import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useContext } from "react";
import { NOTIFICATION } from "../../App";
import { useAuth } from "../../context/authcontext";
import { SocketContext } from "../../context/socketContext";
import classes from "./NotificationDrawer.module.css";
import { v4 } from "uuid";

export const NotificationDrawer = function () {
  const { notifyOtherUser } = useContext(SocketContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    updateCurrentUsersDetails,
    upDateUserData,
    currentUserDetails,
    getAnyUserDetail,
    registerNewPersonalChat,
  } = useAuth();

  console.log(currentUserDetails);

  const friendRequestSentEmailsArray = currentUserDetails.friendRequestSent.map(
    (request) => request.email
  );

  const initialise = function () {
    const initialStateForIsCancelingAnyRequest = {};

    for (const email of friendRequestSentEmailsArray)
      initialStateForIsCancelingAnyRequest[email] = false;

    return initialStateForIsCancelingAnyRequest;
  };

  const [isCancelingAnyRequest, setIsCancelingAnyRequest] = useState(
    initialise()
  );

  const onCancelFriendRequestSent = async function ({ friendRequestReciever }) {
    setIsCancelingAnyRequest((oldValue) => ({
      ...oldValue,
      [friendRequestReciever.email]: true,
    }));

    const friendRequestRecieverDetails = await getAnyUserDetail(
      friendRequestReciever.email
    );

    const updatedFriendRequestSent =
      currentUserDetails.friendRequestSent.filter(
        (friend) => friend.email !== friendRequestReciever.email
      );

    const updatedFriendRequestRecieved =
      friendRequestRecieverDetails.friendRequestRecieved.filter(
        (friend) => friend.email !== currentUserDetails.email
      );

    updateCurrentUsersDetails({
      ...currentUserDetails,
      friendRequestSent: updatedFriendRequestSent,
    });

    upDateUserData(currentUserDetails.FirebaseId, {
      friendRequestSent: updatedFriendRequestSent,
    });

    upDateUserData(friendRequestReciever.FirebaseId, {
      friendRequestRecieved: updatedFriendRequestRecieved,
    });

    notifyOtherUser(friendRequestRecieverDetails.currentSocketId, {
      title: NOTIFICATION[1],
      description: `${currentUserDetails.userName} with email id '${currentUserDetails.email}' canceled friend request sent to you.`,
      payload: {
        email: currentUserDetails.email,
        userName: currentUserDetails.userName,
        FirebaseId: currentUserDetails.FirebaseId,
      },
    });

    setIsCancelingAnyRequest((oldValue) => {
      delete oldValue[friendRequestReciever.email];
      return { ...oldValue };
    });
  };

  const onAcceptFriendRequest = async function ({ friendsRequestSender }) {
    const friendsRequestSenderDetails = await getAnyUserDetail(
      friendsRequestSender.email
    );

    const updatedCurrentUsersDetailsFriendRequestRecieved =
      currentUserDetails.friendRequestRecieved.filter(
        (friend) => friend.email !== friendsRequestSender.email
      );

    const updatedFriendsRequestSenderFriendRequestSent =
      friendsRequestSenderDetails.friendRequestSent.filter(
        (friend) => friend.email !== currentUserDetails.email
      );

    const chatId = v4();

    updateCurrentUsersDetails({
      ...currentUserDetails,
      friends: [
        ...currentUserDetails.friends,
        {
          email: friendsRequestSender.email,
          userName: friendsRequestSender.userName,
          FirebaseId: friendsRequestSender.FirebaseId,
          currentSocketId: friendsRequestSenderDetails.currentSocketId,
          chatId,
        },
      ],
      friendRequestRecieved: updatedCurrentUsersDetailsFriendRequestRecieved,
    });

    upDateUserData(currentUserDetails.FirebaseId, {
      friends: [
        ...currentUserDetails.friends,
        {
          email: friendsRequestSender.email,
          userName: friendsRequestSender.userName,
          FirebaseId: friendsRequestSender.FirebaseId,
          currentSocketId: friendsRequestSenderDetails.currentSocketId,
          chatId,
        },
      ],
      friendRequestRecieved: updatedCurrentUsersDetailsFriendRequestRecieved,
    });

    upDateUserData(friendsRequestSenderDetails.FirebaseId, {
      friends: [
        ...friendsRequestSenderDetails.friends,
        {
          email: currentUserDetails.email,
          userName: currentUserDetails.userName,
          FirebaseId: currentUserDetails.FirebaseId,
          currentSocketId: currentUserDetails.currentSocketId,
          chatId,
        },
      ],
      friendRequestSent: updatedFriendsRequestSenderFriendRequestSent,
    });

    registerNewPersonalChat({
      chatId,
      messages: [],
    });

    notifyOtherUser(friendsRequestSenderDetails.currentSocketId, {
      title: NOTIFICATION[2],
      description: `${currentUserDetails.userName} with email id '${currentUserDetails.email}' accepted your friend request.`,
      payload: {
        email: currentUserDetails.email,
        userName: currentUserDetails.userName,
        FirebaseId: currentUserDetails.FirebaseId,
        currentSocketId: currentUserDetails.currentSocketId,
        chatId,
      },
    });
  };
  const onRejectFriendRequest = async function ({ friendsRequestSender }) {
    const friendRequestSenderDetails = await getAnyUserDetail(
      friendsRequestSender.email
    );

    const updatedCurrentUsersDetailsFriendRequestRecieved =
      currentUserDetails.friendRequestRecieved.filter(
        (friend) => friend.email !== friendsRequestSender.email
      );

    const updatedFriendsRequestSenderFriendRequestSent =
      friendRequestSenderDetails.friendRequestSent.filter(
        (friend) => friend.email !== currentUserDetails.email
      );

    updateCurrentUsersDetails({
      ...currentUserDetails,
      friendRequestRecieved: updatedCurrentUsersDetailsFriendRequestRecieved,
    });

    upDateUserData(currentUserDetails.FirebaseId, {
      friendRequestRecieved: updatedCurrentUsersDetailsFriendRequestRecieved,
    });

    upDateUserData(friendRequestSenderDetails.FirebaseId, {
      friendRequestSent: updatedFriendsRequestSenderFriendRequestSent,
    });

    notifyOtherUser(friendRequestSenderDetails.currentSocketId, {
      title: NOTIFICATION[3],
      description: `${currentUserDetails.userName} with email id '${currentUserDetails.email}' rejected yours friend request.`,
      payload: {
        email: currentUserDetails.email,
        userName: currentUserDetails.userName,
        FirebaseId: currentUserDetails.FirebaseId,
      },
    });
  };

  return (
    <>
      <Tooltip hasArrow label="notifications" bg="gray.300" color="black">
        <svg
          onClick={onOpen}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 27.5C13.6193 27.5 12.5 26.3807 12.5 25H17.5C17.5 26.3807 16.3807 27.5 15 27.5ZM25 23.75H5V21.25L7.5 20V13.125C7.5 8.7975 9.27625 5.99125 12.5 5.225V2.5H17.5V5.225C20.7237 5.99 22.5 8.795 22.5 13.125V20L25 21.25V23.75ZM15 7.1875C13.4746 7.089 12.0035 7.7716 11.0938 9C10.3157 10.2307 9.93392 11.6705 10 13.125V21.25H20V13.125C20.066 11.6705 19.6842 10.2307 18.9062 9C17.9965 7.7716 16.5254 7.089 15 7.1875Z"
            fill="white"
          />
        </svg>
      </Tooltip>
      <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Notifications</DrawerHeader>
          <DrawerBody>
            <div className={classes.friendRequestContainer}>
              <h2 className={classes.friendRequestContainerHeading}>
                <strong>Friend requests received</strong>
              </h2>
              <ul className={classes.friendRequestListContainer}>
                {currentUserDetails.friendRequestRecieved.length === 0 && (
                  <p>no requests received</p>
                )}
                {currentUserDetails.friendRequestRecieved.length !== 0 &&
                  currentUserDetails.friendRequestRecieved.map((item) => (
                    <li
                      className={classes.friendRequestListContainerItem}
                      key={item.email}
                    >
                      <h3>user name: {item.userName}</h3>
                      <p>email: {item.email}</p>
                      <div className={classes.btnContainer}>
                        <Button
                          onClick={onAcceptFriendRequest.bind(this, {
                            friendsRequestSender: item,
                          })}
                          colorScheme="green"
                          style={{ width: "6rem" }}
                        >
                          accept
                        </Button>
                        <Button
                          onClick={onRejectFriendRequest.bind(this, {
                            friendsRequestSender: item,
                          })}
                          colorScheme="red"
                          style={{ width: "6rem" }}
                        >
                          reject
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <div className={classes.friendRequestContainer}>
              <h2 className={classes.friendRequestContainerHeading}>
                <strong>Friend requests sent</strong>
              </h2>
              <ul className={classes.friendRequestListContainer}>
                {currentUserDetails.friendRequestSent.length === 0 && (
                  <p>no requests sent</p>
                )}
                {currentUserDetails.friendRequestSent.length !== 0 &&
                  currentUserDetails.friendRequestSent.map((item) => (
                    <li
                      className={classes.friendRequestListContainerItem}
                      key={item.email}
                    >
                      <h3>{item.userName}</h3>
                      <p>{item.email}</p>
                      <div className={classes.btnContainer}>
                        <Button
                          disabled={isCancelingAnyRequest[item.email]}
                          colorScheme="red"
                          onClick={onCancelFriendRequestSent.bind(this, {
                            friendRequestReciever: item,
                          })}
                        >
                          cancel
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
