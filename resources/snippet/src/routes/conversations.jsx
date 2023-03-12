import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import "../components/message.css";

function resetMessage() {
  document.querySelector("#message").hidden = true;
}

function showMessage(msg, error = false) {
  let label = document.querySelector("#message");
  label.textContent = msg;

  if (error) {
    label.style.color = "red";
  } else {
    label.style.color = "green";
  }

  label.hidden = false;

  setTimeout(resetMessage, 3000);
}

function Conversation() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);

  let access_token = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("access_token="))
    ?.split("=")[1];
  let user_id = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("user_id="))
    ?.split("=")[1];

  useEffect(() => {
    fetch("http://localhost:8000/bottles/my-messages", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            setMessages([data[0]].concat(data[0].responses));
            console.log(data);
          },
          (err) => showMessage(err, true)
        );
      },
      (err) => showMessage(err, true)
    );
  }, []);

  function onSubmit(e) {
    e.preventDefault();

    let messageInput = document.querySelector("#messageInput");
    let body = JSON.stringify({
      response: messageInput.value,
      responding_to_id: conversationId,
    });

    fetch("http://localhost:8000/bottles/respond", {
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) showMessage(JSON.stringify(data), true);
            else {
              setMessages(
                messages.concat({
                  text: messageInput.value,
                  send_date: new Date().toISOString(),
                  profile_id: user_id,
                })
              );
              messageInput.value = "";
            }
          },
          (err) => showMessage(JSON.stringify(err), true)
        );
      },
      (err) => showMessage(err, true)
    );
  }

  return (
    <div>
      <Navbar />
      <div className="Container">
        <h1 className="Title">Viewing Conversation #{conversationId}</h1>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "x-large",
            color: "red",
          }}
          id="message"
          hidden
        >
          MESSAGE
        </p>

        <div className="MessageContainer" id="messageContainer">
          {messages.map((message) => {
            return (
              <div
                className={
                  message.profile_id == user_id
                    ? "Message Mine"
                    : "Message NotMine"
                }
              >
                <p className="Text">{message.text}</p>
                <p className="MessageDateTime">
                  {new Date(message.send_date).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <textarea
          className="TextArea"
          placeholder="Type something..."
          id="messageInput"
        ></textarea>
        <button className="Button" onClick={onSubmit}>
          Send Reply
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Conversation;
