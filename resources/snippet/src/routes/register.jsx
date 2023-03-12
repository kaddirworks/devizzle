import React from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

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

function finalize(email) {
  let label = document.querySelector("#finalization");
  label.textContent = `A confirmation was sent to ${email}!`;
  label.hidden = false;

  let form = document.forms[0];
  form.style.display = "none";
}

function onSubmit(e) {
  e.preventDefault();
  resetMessage();

  let registerForm = document.forms[0];
  let formData = new FormData(registerForm);
  let bodyJSON = Object.fromEntries(formData.entries());

  fetch("http://localhost:8000/auth/register", {
    body: JSON.stringify(bodyJSON),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (res) => {
      res.json().then(
        (data) => {
          if (!res.ok) {
            showMessage(JSON.stringify(data.detail), true);
            return;
          }

          finalize(formData.get("email"));
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
}

function Register(props) {
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

            alignItems: "center",
          }}
        >
          <h1 className="Title">Register</h1>
          <p
            id="finalization"
            style={{
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "xx-large",
            }}
            hidden
          >
            A confirmation was sent to your email!
          </p>
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
              required
            />
            <label className="Text" htmlFor="email">
              Email
            </label>
            <input
              className="Input"
              type="email"
              name="email"
              id="email"
              required
            />
            <label className="Text" htmlFor="password">
              Password
            </label>
            <input
              className="Input"
              type="password"
              name="password"
              id="password"
              required
            />
            <label className="Text" htmlFor="passwordConfirmation">
              Password Confirmation
            </label>
            <input
              className="Input"
              type="password"
              name="passwordConfirmation"
              id="passwordConfirmation"
              required
            />
            <p
              id="message"
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
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
            Already have an account? Click{" "}
            <a className="Link" href="/login">
              here
            </a>{" "}
            to login.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
