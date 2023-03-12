import React, { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import "./profile.css";
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

function hideContent() {
  let content = document.querySelector("#content");
  content.hidden = true;
}

function Profile(props) {
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState({
    dateRegistered: "never",
    sentCount: "none",
    receivedCount: "none",
    reputation: "none",
    ranking: "none",
  });
  const [messages, setMessages] = useState([]);

  const access_token = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("access_token="))
    ?.split("=")[1];

  useEffect(() => {
    // try to add new message
    fetch("http://localhost:8000/bottles/receive", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then(
      (_res) => {
        // do nothing, the message was added in the background
      },
      (err) => {
        showMessage(err, true);
        hideContent(); // probably critical if we're here so hide it
      }
    );

    // try to get the messages
    fetch("http://localhost:8000/bottles/my-messages", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            setMessages(data);
          },
          (err) => showMessage(err)
        );
        // do nothing, the message was added in the background
      },
      (err) => {
        showMessage(err, true);
        hideContent(); // probably critical if we're here so hide it
      }
    );

    // try to get the profile info
    fetch("http://localhost:8000/bottles/profile", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) {
              if (res.status == 401) {
                showMessage(data.detail, true);
                return;
              }
              showMessage(data.detail, true);
              hideContent();
              return;
            }
            setProfileInfo({
              dateRegistered: new Date(data.date_created).toLocaleString(),
              sentCount: data.sent_count,
              receivedCount: data.received_count,
              reputation: data.reputation,
              ranking: data.ranking,
            });
            setMessages(data.messages);
          },
          (err) => {
            showMessage(err, true);
            hideContent();
          }
        );
      },
      (err) => {
        showMessage(err, true);
        hideContent();
      }
    );
  }, []);

  function handleLogOut(e) {
    e.preventDefault();

    document.cookie = "access_token=;";
    document.cookie = "username=;";
    document.cookie = `user_id=;`;

    navigate("/login");
  }

  return (
    <div>
      <Navbar />
      <div className="Container">
        <h1 className="Title">My Profile</h1>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "xx-large",
            color: "red",
          }}
          id="message"
          hidden
        >
          An error ocurred and we could not find your profile data.
        </p>

        <div id="content">
          <h2 className="SectionTitle">Stats</h2>
          <div className="Row">
            <div className="Column">
              <p className="Text">Registered: {profileInfo.dateRegistered}</p>
              <p className="Text">Sent: {profileInfo.sentCount}</p>
              <p className="Text">Received: {profileInfo.receivedCount}</p>
            </div>
            <div className="Column">
              <p
                className="Text"
                style={{
                  fontWeight: "bold",
                }}
              >
                Reputation: {profileInfo.reputation}
              </p>
              <p
                className="Text"
                style={{
                  fontWeight: "bold",
                }}
              >
                Global Ranking: #{profileInfo.ranking}
              </p>
            </div>
          </div>

          <div className="MessagesSectionTitle">
            <h2 className="SectionTitle">Messages</h2>
            <a className="Link" href={"write"}>
              New Message
            </a>
          </div>
          {messages.length == 0 ? (
            <p
              className="Text"
              style={{
                textAlign: "center",
              }}
            >
              You have not sent or received any messages. When a new message
              arrives it will appear here.
            </p>
          ) : (
            <div>
              {messages.map((message) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "0.8em",
                    }}
                  >
                    <div className="Column">
                      <a
                        className="Link"
                        href={`/profile/conversations/${message.id}`}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "right",
                            fontWeight: message.hasUnreadMessages
                              ? "bolder"
                              : "",
                          }}
                        >
                          {message.text} {message.hasUnreadMessages ? " *" : ""}
                        </div>
                      </a>
                    </div>
                    <div className="Column">
                      <p className="Text">
                        {new Date(message.send_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="Row">
                <button className="Button" disabled>
                  Previous Page
                </button>
                <button className="Button">Next Page</button>
              </div>
            </div>
          )}

          <button onClick={handleLogOut} className="Button">
            Log out
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
