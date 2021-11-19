import React from "react";
import { v4 } from "uuid";
import classes from "./ChatList.module.css";

export default function ChatList(props) {
  const sender = props.sender;
  const messages = props.messages;

  console.log(messages);

  return (
    <ul className={classes.chatList}>
      {messages.map((message) => (
        <li
          className={
            classes[`${message.sender === sender ? "self" : "otherSender"}`]
          }
          key={v4()}
        >
          <p
            className={
              classes[
                `${message.sender === sender ? "selfMessage" : "otherMessage"}`
              ]
            }
          >
            {message.sender !== sender && (
              <i>
                <span className={classes.senderNameClass}>
                  ...
                  {message.sender}
                </span>
              </i>
            )}
            {message.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
