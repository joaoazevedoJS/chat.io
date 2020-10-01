import React, { useEffect, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import socket from "../../services/socket";

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
    socket.emit("getMessages");

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

  function handleMessage(message: string) {
    if (message.length > 250) return;

    setMessageLength(250 - message.length);
    setUserMessage(message);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!userMessage) return setError("Digite uma mensagem!");
    
    socket.emit("sendMessage", userMessage);
    
    setMessageLength(250);
    setUserMessage("");
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
      </header>

      <div className="App-chat">
        <AlertError error={error} setError={setError} />

        <Chat messages={messages} user_id={socket.id} />

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
