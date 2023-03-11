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
  label.hidden = false;

  if (error) {
    label.style.color = "red";
  } else {
    label.style.color = "green";
  }
}

function Login(props) {
  const navigate = useNavigate();

  const handleToken = (token) => {
    document.cookie = `access_token=${token}`;
    navigate("/profile");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    resetMessage();

    let form = document.forms[0];
    let formData = new FormData(form);

    fetch("http://localhost:8000/auth/login", {
      method: "POST",
      body: formData,
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) {
              showMessage(data.detail, true);
              return;
            }

            handleToken(data.access_token);
          },
          (err) => {
            showMessage(err, true);
          }
        );
      },
      (err) => {
        showMessage(err, true);
      }
    );
  };

  return (
    <div>
      <Navbar />
      <div className="Container">
        <div
          style={{
            maxWidth: "50em",
            margin: "auto",

            display: "flex",
            flexDirection: "column",
            rowGap: "1em",
          }}
        >
          <h1 className="Title">Login</h1>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "0.5em",
            }}
          >
            <label className="Text" htmlFor="username">
              Username
            </label>
            <input
              className="Input"
              type="text"
              name="username"
              id="username"
            />
            <label className="Text" htmlFor="password">
              Password
            </label>
            <input
              className="Input"
              type="password"
              name="password"
              id="password"
            />

            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
              id="message"
              hidden
            >
              MESSAGE
            </p>

            <input
              className="Button"
              type="submit"
              value="Submit"
              onSubmit={onSubmit}
              onClick={onSubmit}
            />
          </form>
          <p
            className="Text"
            style={{
              maxWidth: "15em",
              textAlign: "center",
            }}
          >
            Does not have an account? Create an account{" "}
            <a className="Link" href="/register">
              here
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
