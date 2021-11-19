import React from "react";
import { v4 } from "uuid";
import classes from "./ActiveUsers.module.css";

export default function ActiveUsers(props) {
  const { activeUsers, self } = props;

  return (
    <ul className={classes.activeUsersList}>
      {activeUsers.map((activeUser) => (
        <li key={v4()} className={classes.activeUsersListItem}>
          <span>{activeUser === self ? "you" : activeUser}</span>
        </li>
      ))}
    </ul>
  );
}
