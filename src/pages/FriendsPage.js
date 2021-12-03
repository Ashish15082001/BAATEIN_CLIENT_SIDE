import React from "react";
import authContext from "../context/authcontext";

export default function FriendsPage() {
  const { currentUsersDetails } = useContext(authContext);

  if (currentUsersDetails.friends.length === 0)
    return <h2>aweeee you have no friends. 😂</h2>;
  return <div> friends list</div>;
}
