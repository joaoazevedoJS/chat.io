import React, { useEffect, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import socket from "../../services/socket";

import dateUTC from "../../utils/dateUTC";
import GenerateColor from "../../utils/GenerateColor";

import Chat from "../../components/Chat/Chat";
import AlertError from "../../components/AlertError/AlertError";

import "./styles.css";

interface UserMessage {
  user_name: string;
  user_id: string;
  message: string;
  message_date: string;
  user_color: string;
}

const Chatio = function () {
  const history = useHistory();

  const [error, setError] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messageLength, setMessageLength] = useState(250);

  useEffect(() => {
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

  async function  handleBack() {
    history.push('/')
  }

  function getDate() {
    const date = dateUTC();

    const hours =
      date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
    const minutes =
      date.getUTCMinutes() < 10
        ? `0${date.getUTCMinutes()}`
        : date.getUTCMinutes();

    const formated = `${hours}:${minutes}`;

    return formated;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const user_name = localStorage.getItem("user_name") || "Anonimo";

    let user_color = localStorage.getItem("color")

    if(!user_color) {
      const color = GenerateColor()

      localStorage.setItem("color", color);

      user_color = color
    }
    
    let user_id = localStorage.getItem("user_id")

    if(!user_id) {
      user_id = socket.id;

      localStorage.setItem("user_id", socket.id);
    }

    if (!userMessage) {
      return setError("Digite uma mensagem!");
    }

    const user_message = {
      user_name: user_name.trim(),
      user_id,
      message: userMessage,
      message_date: getDate(),
      user_color,
    };

    setMessageLength(250);
    setUserMessage("");

    setMessages([...messages, user_message]);

    socket.emit("sendMessage", user_message);
  }

  function handleMessage(message: string) {
    if (message.length > 250) {
      return;
    }

    setMessageLength(250 - message.length);
    setUserMessage(message);
  }

  function updateScroll() {
    const element = document.querySelector("main.chat");

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <div id="chatio">
      <header>
        <h1 onClick={handleBack}>Chat.io</h1>

        <nav>
          <p onClick={handleBack}>nickname</p>
        </nav>
      </header>

      <div className="App-chat">
        <AlertError error={error} setError={setError} />

        <Chat messages={messages} />

        <form onSubmit={handleSubmit}>
          <footer>
            <p className="messageLength">{messageLength}</p>
            <div className="group-button">
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
    </div>
  );
};

export default Chatio;
