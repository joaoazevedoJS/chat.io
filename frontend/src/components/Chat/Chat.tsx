import React, { FC } from "react";

import "./styles.css";

interface UserMessage {
  user_name: string;
  user_id: string;
  message: string;
  message_date: string;
  user_color: string;
}

interface ChatMessages {
  messages: Array<UserMessage>;
}

const Chat: FC<ChatMessages> = function ({ messages }) {
  function userValidation(message: UserMessage) {
    const user_id = localStorage.getItem("user_id");

    return user_id === message.user_id ? "userMessage" : "chatMessage";
  }

  function chatMessage(messages: Array<UserMessage>) {
    return messages.map((message, index) => (
      <div key={index} className={userValidation(message)}>
        <span style={{ color: message.user_color }}>
          {message.user_name} - {message.message_date}
        </span>
        <div className="message">{message.message}</div>
      </div>
    ));
  }

  return <main className="chat">{chatMessage(messages)}</main>;
};

export default Chat;
