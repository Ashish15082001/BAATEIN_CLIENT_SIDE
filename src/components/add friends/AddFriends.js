import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/skeleton";
import React, { useState, useContext, useEffect } from "react";
import { v4 } from "uuid";
import { AuthContext } from "../../context/authcontext";
import { FriendsContext } from "../../context/friendsContext";
import { SocketContext } from "../../context/socketContext";
import classes from "./AddFriends.module.css";

export default function AddFriends() {
  const [isLoadingAddFriendsList, setIsLoadingAddFriendsList] = useState(false);
  const { getAddFriends, addFriends } = useContext(FriendsContext);
  const { updateCurrentUsersDetails, upDateUserData, currentUserDetails } =
    useContext(AuthContext);
  const { notifyOtherUser } = useContext(SocketContext);
  const skeletonRepeater = [1, 2, 3, 4, 5];

  useEffect(() => {
    setIsLoadingAddFriendsList(true);
    const getAddFriendsData = async function () {
      await getAddFriends();
    };

    getAddFriendsData();
    setIsLoadingAddFriendsList(false);
  }, []);

  const onSendFriendRequest = function (otherUsersEmail) {
    const reciever = addFriends.filter(
      (friend) => friend.email === otherUsersEmail
    )[0];

    updateCurrentUsersDetails({
      ...currentUserDetails,
      friendRequestSent: [
        ...currentUserDetails.friendRequestSent,
        { email: reciever.email, userName: reciever.userName },
      ],
    });
    upDateUserData(currentUserDetails.FirebaseId, {
      friendRequestSent: [
        ...currentUserDetails.friendRequestSent,
        { email: reciever.email, userName: reciever.userName },
      ],
    });

    upDateUserData(reciever.FirebaseId, {
      friendRequestRecieved: [
        ...reciever.friendRequestRecieved,
        {
          email: currentUserDetails.email,
          userName: currentUserDetails.userName,
        },
      ],
    });

    notifyOtherUser(reciever.currentSocketId, {
      title: "new friend request",
      userName: currentUserDetails.userName,
      email: currentUserDetails.email,
    });
  };

  if (isLoadingAddFriendsList)
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
                  onClick={onSendFriendRequest.bind(this, friend.email)}
                >
                  friend request sent
                </Button>
              ) : (
                <Button
                  // isLoading
                  loadingText="sending request"
                  colorScheme="teal"
                  variant="outline"
                  onClick={onSendFriendRequest.bind(this, friend.email)}
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
