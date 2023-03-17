import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div className="container is-fluid">
      <div className="content">
        <h1>Viewing Conversation #{conversationId}</h1>
        
      </div>
    </div>
  );
}

export default Conversation;
