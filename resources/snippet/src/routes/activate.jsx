import React from "react";
import { useLoaderData } from "react-router-dom";

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

function activateLoader({ params }) {
  return {
    secretCode: params.secretCode,
  };
}

function Activate(props) {
  const { secretCode } = useLoaderData();

  fetch("http://localhost:8000/auth/activate/" + secretCode).then(
    (res) => {
      res.json().then(
        (data) => {
          if (!res.ok) {
            showMessage(data.detail, true);
            return;
          }

          showMessage("Your account was successfully activated!");
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

export { activateLoader };

export default Activate;
