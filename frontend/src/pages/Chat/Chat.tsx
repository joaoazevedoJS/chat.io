import React, { useEffect, useState, FormEvent } from "react";

import socket from "../../services/socket";
import LocationPage from "../../utils/LocationPage";

import "./styles.css";

interface UserMessage {
  user_name: string;
  user_id: string;
  message: string;
}

const Chat = function () {
  const [error, setError] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    LocationPage.setLocation();

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const user_name = localStorage.getItem("user_name") || "Anonimo";

    if(!userMessage) {
      setError("Digite uma mensagem!")

      setTimeout(() => {
        setError("");
      }, 2000);

      return;
    } 

    const user_message = {
      user_name,
      user_id: socket.id,
      message: userMessage,
    };

    setUserMessage("");

    setMessages([...messages, user_message]);

    socket.emit("sendMessage", user_message);
  }

  function updateScroll() {
    const element = document.querySelector("main.message");

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <div className="App">
      {error ? <div className="alert">{error}</div> : ""}

      <form onSubmit={handleSubmit}>
        <main className="message">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatMessage ${
                socket.id === message.user_id ? "userMessage" : "message"
              }`}
            >
              <span>{message.user_name}</span>
              <div className="messageContent">{message.message}</div>
            </div>
          ))}
        </main>

        <footer>
          <input
            type="text"
            placeholder="Digite sua mensagem"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button>Enviar</button>
        </footer>
      </form>
    </div>
  );
};

export default Chat;
