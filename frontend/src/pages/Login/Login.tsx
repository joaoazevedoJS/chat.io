import React, { FormEvent, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import BackgroundHero from "../../assets/images/background-hero.svg";
import socket from "../../services/socket";

import "./styles.css";

const Login = function () {
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [connections, setConnections] = useState(0);
  const [connectionsText, setConnectionsText] = useState("");

  useEffect(() => {
    socket.emit("getConnections");

    socket.on("siteConnections", (connections: number) => {
      setConnections(connections - 1);
    });

    socket.on("siteDisconnect", (connections: number) => {
      setConnections(connections - 1);
    });
  }, []);

  useEffect(() => {
    if (connections === 0) {
      setConnectionsText("Ninguem está online no momento!");
    } else if (connections === 1) {
      setConnectionsText(`${connections} pessoa online`);
    } else {
      setConnectionsText(`${connections} pessoas onlines!`);
    }
  }, [connections]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    socket.emit('userName', username)

    history.push("/chatio");
  }

  return (
    <div id="login">
      <header>
        <h1>Chat.io</h1>
      </header>

      <main>
        <section className="login-chat">
          <form onSubmit={handleSubmit}>
            <div className="nickname">
              <label htmlFor="username">Digite seu nickname</label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="group-connectios">
              <p>{connectionsText}</p>

              <button>Entrar</button>
            </div>
          </form>
        </section>

        <img src={BackgroundHero} alt="chat.io" />
      </main>
    </div>
  );
};

export default Login;
