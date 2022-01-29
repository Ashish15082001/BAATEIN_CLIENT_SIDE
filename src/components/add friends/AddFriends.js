import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/skeleton";
import React, { useState, useContext, useEffect } from "react";
import { v4 } from "uuid";
import { AuthContext } from "../../context/authcontext";
import { FriendsContext } from "../../context/friendsContext";
import { SocketContext } from "../../context/socketContext";
import classes from "./AddFriends.module.css";
import { NOTIFICATION } from "../../App";

export default function AddFriends() {
  const [isLoadingAddFriendsList, setIsLoadingAddFriendsList] = useState(false);
  const { getAddFriends, addFriends } = useContext(FriendsContext);
  const {
    updateCurrentUsersDetails,
    upDateUserData,
    currentUserDetails,
    getAnyUserDetail,
  } = useContext(AuthContext);
  const { notifyOtherUser } = useContext(SocketContext);
  const skeletonRepeater = [1, 2, 3, 4, 5];

  useEffect(() => {
    setIsLoadingAddFriendsList(true);
    const getAddFriendsData = async function () {
      await getAddFriends();
      setIsLoadingAddFriendsList(false);
    };

    getAddFriendsData();
  }, [getAddFriends]);

  const onSendFriendRequest = async function ({ friendRequestReciever }) {
    const friendRequestRecieverDetails = await getAnyUserDetail(
      friendRequestReciever.email
    );

    const updatedFriendRequestSent = [
      ...currentUserDetails.friendRequestSent,
      {
        email: friendRequestReciever.email,
        userName: friendRequestReciever.userName,
        FirebaseId: friendRequestReciever.FirebaseId,
      },
    ];

    const updatedFriendRequestRecieved = [
      ...friendRequestRecieverDetails.friendRequestRecieved,
      {
        email: currentUserDetails.email,
        userName: currentUserDetails.userName,
        FirebaseId: currentUserDetails.FirebaseId,
      },
    ];

    updateCurrentUsersDetails({
      ...currentUserDetails,
      friendRequestSent: updatedFriendRequestSent,
    });

    upDateUserData(currentUserDetails.FirebaseId, {
      friendRequestSent: updatedFriendRequestSent,
    });

    upDateUserData(friendRequestRecieverDetails.FirebaseId, {
      friendRequestRecieved: updatedFriendRequestRecieved,
    });

    notifyOtherUser(friendRequestRecieverDetails.currentSocketId, {
      title: NOTIFICATION[0],
      description: `${currentUserDetails.userName} with email id '${currentUserDetails.email}' sent you a friend request.`,
      payload: {
        email: currentUserDetails.email,
        userName: currentUserDetails.userName,
        FirebaseId: currentUserDetails.FirebaseId,
      },
    });
  };

  console.log(isLoadingAddFriendsList);

  if (true)
    return (
      <div className={classes.FriendsListContainer}>
        {skeletonRepeater.map(() => (
          <Box
            key={v4()}
            padding="6"
            boxShadow="lg"
            bg="white"
            style={{ width: "350px", margin: "2rem" }}
          >
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        ))}
      </div>
    );

  if (addFriends.length === 0) return <h2>no friends to add.</h2>;

  const ButtonComponent = function (addFriendEmail) {
    return currentUserDetails.friendRequestSent.some(
      (request) => request.email === addFriendEmail
    );
  };

  return (
    <div className={classes.FriendsListContainer}>
      <ul className={classes.list}>
        {addFriends.map((friend) => (
          <li className={classes.listItem} key={friend.FirebaseId}>
            <div className={classes.profileCard}>
              <img
                className={classes.profilePic}
                alt={`${friend.userName} profile pic`}
                src="/images/unnamed.jpg"
              />
              <h2 className={classes.userName}>{friend.userName}</h2>
              <p className={classes.email}>{friend.email}</p>
              {ButtonComponent(friend.email) === true ? (
                <Button
                  // isLoading
                  disabled
                  loadingText="sending request"
                  colorScheme="teal"
                  variant="outline"
                >
                  friend request sent
                </Button>
              ) : (
                <Button
                  // isLoading
                  loadingText="sending request"
                  colorScheme="teal"
                  variant="outline"
                  onClick={onSendFriendRequest.bind(this, {
                    friendRequestReciever: friend,
                  })}
                >
                  send friend request
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
