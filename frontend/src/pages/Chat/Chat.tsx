import React, { useEffect, useState, FormEvent } from "react";

import socket from "../../services/socket";

import LocationPage from "../../utils/LocationPage";
import dateUTC from "../../utils/dateUTC";
import GenerateColor from "../../utils/GenerateColor";

import "./styles.css";

interface UserMessage {
  user_name: string;
  user_id: string;
  message: string;
  message_date: string
  user_color: string
}

const Chat = function () {
  const [error, setError] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messageLength, setMessageLength] = useState(250);
  
  useEffect(() => {
    LocationPage.setLocation();

    localStorage.setItem('color', GenerateColor())

    socket.emit("getMessages", (chatMessage: Array<UserMessage>) =>
      setMessages(chatMessage)
    );

    socket.on("chatMessage", (chatMessage: Array<UserMessage>) =>
      setMessages(chatMessage)
    );
  }, []);

  useEffect(() => {
    updateScroll();
  }, [messages]);

  function getDate() {
    const date = dateUTC()

    const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
    const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()

    const formated = `${hours}:${minutes}` 
  
    return formated
  }

  function ErrorAlert(message: string) {
    setError(message)

    setTimeout(() => {
      setError("");
    }, 2000);

    return false;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const user_name = localStorage.getItem("user_name") || "Anonimo";

    if(!userMessage) {
      return ErrorAlert("Digite uma mensagem!")
    } 

    const user_message = {
      user_name,
      user_id: socket.id,
      message: userMessage,
      message_date: getDate(),
      user_color: localStorage.getItem('color') || ''
    };

    setMessageLength(250);
    setUserMessage("");

    setMessages([...messages, user_message]);

    socket.emit("sendMessage", user_message);
  }

  function userValidation(message: UserMessage) {
    return socket.id === message.user_id ? "userMessage" : "chatMessage"
  }

  function handleMessage(message: string) {
    if(message.length > 250) {
      return;
    }

    setMessageLength(250 - message.length);
    setUserMessage(message)
  }

  function updateScroll() {
    const element = document.querySelector("main.chat");

    if (element) {
      element.scrollTop = element.scrollHeight;
    }  
  }

  return (
    <div className="App-chat">
      {error ? <div className="alert">{error}</div> : ""}

      <form onSubmit={handleSubmit}>
        <main className="chat">
          {
            messages.map((message, index) => (
              <div
                key={index}
                className={userValidation(message)}
              >
                <span style={{ color: message.user_color }}>{message.user_name} - {message.message_date}</span>
                <div className="message">{message.message}</div>
              </div>
            ))
          }
        </main>
        
        <footer>
          <span className="messageLength">{messageLength}</span>
          <div className="group">
            <input
              type="text"
              placeholder="Digite sua mensagem"
              value={userMessage}
              onChange={(e) => handleMessage(e.target.value)}
            />
            <button className="btn">Enviar</button>
          </div>
        </footer>
      </form>
    </div>
  );
};

export default Chat;
