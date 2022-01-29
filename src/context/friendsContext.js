// this context provides
// 1. friends (containes array which stores data of all other users who are friend of current user)
// 2. addFriends (containes array which stores data of all other users who are using this application, excluding friends)
// 3. getAddFriends (gets data of all users and stores it in addFriends array)

import React, { useCallback, useContext, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { AuthContext } from "./authcontext";
import { APP_USERS } from "../App";

export const FriendsContext = React.createContext({
  friends: [],
  addFriends: [],
  getAddFriends: () => {},
  resetFriendsContext: () => {},
});

export default function FriendsContextProvider(props) {
  const usersCollection = collection(db, "users");
  const [addFriends, setAddFriends] = useState([]);
  const { currentUserDetails } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  const isFriendRequestRecieved = function (email) {
    return currentUserDetails.friendRequestRecieved.some(
      (user) => user.email === email
    );
  };

  const isFriend = function (email) {
    return currentUserDetails.friends.some((friend) => friend.email === email);
  };

  const getAddFriends = useCallback(
    async function () {
      const data = await getDocs(usersCollection);
      const usersData = [];

      data.forEach((doc) => {
        if (
          doc.data().email !== currentUserDetails.email &&
          isFriendRequestRecieved(doc.data().email) === false &&
          isFriend(doc.data().email) === false
        )
          usersData.push({ ...doc.data(), FirebaseId: doc.id });
        APP_USERS[doc.data().email] = {
          currentSocketId: doc.data().currentSocketId,
          FirebaseId: doc.id,
        };
      });

      setAddFriends(usersData);
    },
    [currentUserDetails, getDocs, setAddFriends]
  );

  const resetFriendsContext = function () {
    setFriends([]);
    setAddFriends([]);
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        addFriends,
        getAddFriends,
        resetFriendsContext,
      }}
    >
      {props.children}
    </FriendsContext.Provider>
  );
}
