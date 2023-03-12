import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Footer from "../components/footer";

function showMessage(msg, error = false) {
  let label = document.querySelector("#message");
  label.hidden = false;
  label.textContent = msg;

  if (error) {
    label.style.color = "red";
    let secondaryLabel = document.querySelector("#secondary");
    secondaryLabel.hidden = true;
  } else {
    label.style.color = "green";
  }
}

function Activate(props) {
  const { secretCode } = useParams();
  const navigate = useNavigate();

  const handleLogin = (token, username, expiration) => {
    let exp = new Date(expiration).toUTCString();
    document.cookie = `access_token=${token}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `username=${username}; SameSite=Lax; expires=${exp}; Secure;`;
    navigate("/profile");
  };

  fetch("http://localhost:8000/auth/activate/" + secretCode).then(
    (res) => {
      res.json().then(
        (data) => {
          if (!res.ok) {
            showMessage(data.detail, true);
            return;
          }

          handleLogin(data.access_token, data.username, data.expiration);

          showMessage("Your account was successfully activated!");
          setTimeout(() => {
            navigate("/profile");
          }, 10000);
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

  return (
    <>
      <Navbar />
      <Container>
        <p
          id="message"
          style={{
            fontWeight: "bolder",
            fontSize: "xx-large",
            textAlign: "center",
          }}
        ></p>
        <p
          id="secondary"
          className="Text"
          style={{
            textAlign: "center",
          }}
        >
          Go to{" "}
          <a className="Link" href="/profile">
            my profile
          </a>
          .
        </p>
      </Container>
      <Footer />
    </>
  );
}

export default Activate;
