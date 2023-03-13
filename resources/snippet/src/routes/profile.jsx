import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

function Profile(props) {
  const [error, setError] = useState(null);
  const [profileInfo, setProfileInfo] = useState({
    dateRegistered: "never",
    sentCount: "none",
    receivedCount: "none",
    reputation: "none",
    ranking: "none",
  });
  const [messages, setMessages] = useState([]);
  const [viewingMessage, setViewingMessage] = useState(null);

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
      (err) => setError(JSON.stringify(err))
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
            setViewingMessage(data[0]);
          },
          (err) => setError(JSON.stringify(err))
        );
        // do nothing, the message was added in the background
      },
      (err) => setError(JSON.stringify(err))
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
            if (!res.ok) setError(data.detail);
            else {
              setProfileInfo({
                dateRegistered: new Date(
                  data.date_created
                ).toLocaleDateString(),
                sentCount: data.sent_count,
                receivedCount: data.received_count,
                reputation: data.reputation,
                ranking: data.ranking,
              });
              setMessages(data.messages);
            }
          },
          (err) => setError(JSON.stringify(err))
        );
      },
      (err) => setError(JSON.stringify(err))
    );
  }, []);

  const userInfo = {
    username: "JohnDoe",
    id: 1,
  };

  function onSubmit(e) {
    e.preventDefault();

    let form = document.forms[0];
    let response = new FormData(form).get("response");
    let body = JSON.stringify({
      response,
      responding_to_id: viewingMessage.id,
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
            if (!res.ok) setError(JSON.stringify(data.detail));
            else {
              let newViewingMessage = {
                ...viewingMessage,
              };
              newViewingMessage.responses =
                newViewingMessage.responses.concat(data);
              setViewingMessage(newViewingMessage);
              document.querySelector("#response").value = "";
            }
          },
          (err) => setError(JSON.stringify(err))
        );
      },
      (err) => setError(JSON.stringify(err))
    );
  }

  function changeViewingMessage(e) {
    e.preventDefault();

    let targetMessage = messages.find(
      (message) => message.id == Number.parseInt(e.target.target)
    );
    setViewingMessage(targetMessage);
  }

  return (
    <div className="container is-fluid">
      <div className="content">
        {error && <h1>{error}</h1>}
        {!error && (
          <>
            <h1>{userInfo.username}</h1>
            <div className="box">
              <h2>Stats</h2>
              <nav className="level">
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Member Since</p>
                    <p className="title">{profileInfo.dateRegistered}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Messages Sent</p>
                    <p className="title">{profileInfo.sentCount}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Messages Received</p>
                    <p className="title">{profileInfo.receivedCount}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Reputation</p>
                    <p className="title">{profileInfo.reputation}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <p className="heading">Ranking</p>
                    <p className="title">{profileInfo.ranking}</p>
                  </div>
                </div>
              </nav>
            </div>

            <div className="box">
              <h2>
                Messages{" "}
                <span>
                  <Link className="tag is-link" to="/write">
                    Write New Message
                  </Link>
                </span>
              </h2>

              {messages.length == 0 && (
                <p>
                  You have no messages yet! Whenever you send or receive a
                  message it will appear here.
                </p>
              )}
              {messages.length > 0 && (
                <div className="container is-fluid">
                  <div className="columns">
                    <div className="column is-narrow">
                      <nav className="panel">
                        <p className="panel-heading">Conversations</p>
                        <div
                          style={{
                            maxHeight: "30em",
                            overflow: "auto",
                          }}
                        >
                          {messages.map((message) => {
                            return (
                              <a
                                key={`message-list-item-${message.id}`}
                                className={
                                  viewingMessage &&
                                  message.id == viewingMessage.id
                                    ? "panel-block is-active"
                                    : "panel-block"
                                }
                                target={message.id}
                                onClick={changeViewingMessage}
                              >
                                {/* FIXME: icon not being rendered for some reason. */}
                                <span className="panel-icon">
                                  <i className="fa-solid fa-comment"></i>
                                </span>
                                {message.text}
                              </a>
                            );
                          })}
                        </div>
                        <div className="panel-block">
                          <button className="button is-link is-fullwidth">
                            Load More
                          </button>
                        </div>
                      </nav>
                    </div>

                    {viewingMessage && (
                      <>
                        <div className="column">
                          <article className="panel is-info">
                            <p className="panel-heading">
                              {viewingMessage.text}
                            </p>

                            <>
                              <div
                                className="container is-fluid"
                                style={{
                                  maxHeight: "30em",
                                  overflow: "auto",
                                }}
                              >
                                <article
                                  key={`response-${viewingMessage.id}`}
                                  className="media"
                                >
                                  <div className="media-content">
                                    <div className="content">
                                      <p>
                                        <strong>
                                          {viewingMessage.profile_id ==
                                          userInfo.id
                                            ? "Me"
                                            : "User"}
                                        </strong>{" "}
                                        <small>
                                          #{viewingMessage.profile_id}
                                        </small>{" "}
                                        <small>
                                          {new Date(
                                            viewingMessage.send_date
                                          ).toLocaleString()}
                                        </small>
                                        <br />
                                        {viewingMessage.text}
                                      </p>
                                    </div>
                                  </div>
                                </article>
                                {viewingMessage.responses.map((response) => {
                                  return (
                                    <article
                                      className="media"
                                      key={`response-${response.id}`}
                                    >
                                      <div className="media-content">
                                        <div className="content">
                                          <p>
                                            <strong>
                                              {response.profile_id ==
                                              userInfo.id
                                                ? "Me"
                                                : "User"}
                                            </strong>{" "}
                                            <small>
                                              #{response.profile_id}
                                            </small>{" "}
                                            <small>
                                              {new Date(
                                                response.send_date
                                              ).toLocaleString()}
                                            </small>
                                            <br />
                                            {response.text}
                                          </p>
                                        </div>
                                      </div>
                                    </article>
                                  );
                                })}
                              </div>
                            </>
                          </article>
                          <form className="container is-fluid">
                            <div className="columns">
                              <div className="column">
                                <input
                                  className="input is-fullwidth"
                                  type="text"
                                  placeholder="Type something..."
                                  name="response"
                                  id="response"
                                />
                              </div>
                              <div className="column is-narrow">
                                <input
                                  className="button is-primary"
                                  type="submit"
                                  value="Send"
                                  onClick={onSubmit}
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
