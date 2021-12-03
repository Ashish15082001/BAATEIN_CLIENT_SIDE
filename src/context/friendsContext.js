import React, { useContext, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { AuthContext } from "./authcontext";

export const FriendsContext = React.createContext({
  friends: null,
  addFriends: null,
  getAddFriends: () => {},
  resetFriendsContext: () => {},
});

export default function FriendsContextProvider(props) {
  const usersCollection = collection(db, "users");
  const [addFriends, setAddFriends] = useState([]);
  const { currentUserDetails } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  const getAddFriends = async function () {
    const data = await getDocs(usersCollection);
    const usersData = [];

    data.forEach((doc) => {
      if (doc.data().userName !== currentUserDetails.userName)
        usersData.push({ ...doc.data(), FirebaseId: doc.id });
    });

    setAddFriends(usersData);
  };

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
