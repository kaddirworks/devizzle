import React from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

function resetMessage() {
  let label = document.querySelector("#message");
  label.hidden = true;
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
}

function Write() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const access_token = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("access_token="))
      ?.split("=")[1];
    let message = document.querySelector("#messageInput").value;
    let body = JSON.stringify({
      message: message,
    });

    fetch("http://localhost:8000/bottles/send", {
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
            if (!res.ok) showMessage(JSON.stringify(data.detail), true);
            else {
              showMessage("Your message was sent!");
              setTimeout(() => {
                navigate("/profile");
              }, 3000);
            }
          },
          (err) => showMessage(err, true)
        );
      },
      (err) => showMessage(err, true)
    );
  }

  return (
    <div>
      <Navbar />
      <div className="Container">
        <h1 className="Title">New Message</h1>

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

        <textarea
          className="TextArea"
          placeholder="Type something..."
          id="messageInput"
        ></textarea>
        <button className="Button" onClick={handleSubmit}>
          Send
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Write;
