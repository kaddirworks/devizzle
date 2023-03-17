import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";

import UserContext from "../context/user";

class Profile extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);

    this.state = {
      error: null,
    };

    this.changeViewingMessage = this.changeViewingMessage.bind(this);
    this.handleSendResponse = this.handleSendResponse.bind(this);
  }

  setError(err) {
    this.setState({ error: err });
  }

  handleSendResponse(e) {
    e.preventDefault();

    let form = document.forms[0];
    let response = new FormData(form).get("response");
    let body = JSON.stringify({
      response,
      responding_to_id: this.context.viewingMessage.id,
    });

    fetch("http://localhost:8000/bottles/respond", {
      headers: {
        Authorization: "Bearer " + this.context.userInfo.accessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) this.setError(JSON.stringify(data.detail));
            else {
              let oldViewingMessage = this.context.viewingMessage;
              let newViewingMessage = { ...this.context.viewingMessage };
              newViewingMessage.responses.push(data);
              this.context.set({
                viewingMessage: newViewingMessage,
              });
              document.querySelector("#response").value = "";
            }
          },
          (err) => this.setError(JSON.stringify(err))
        );
      },
      (err) => this.setError(JSON.stringify(err))
    );
  }

  changeViewingMessage(e) {
    e.preventDefault();

    this.context.set({
      viewingMessage: this.context.messages.find(
        (elem) => elem.id == Number.parseInt(e.target.target)
      ),
    });
  }

  render() {
    if (!this.context.userInfo)
      return (
        <div className="container is-fluid">
          <div className="content">
            <p>Loading...</p>
          </div>
        </div>
      );

    if (this.context.mustRelogin) return <Navigate to="/login" />;

    return (
      <div className="container is-fluid">
        <div className="content">
          {this.state.error && <h1>{this.state.error}</h1>}
          {!this.state.error && (
            <>
              <h1>
                Welcome back, <strong>{this.context.userInfo.username}</strong>!
              </h1>
              <div className="box">
                <h2>Stats</h2>
                <nav className="level">
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Member Since</p>
                      <p className="title">{this.context.dateRegistered}</p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Messages Sent</p>
                      <p className="title">{this.context.sentCount}</p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Messages Received</p>
                      <p className="title">{this.context.receivedCount}</p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Reputation</p>
                      <p className="title">{this.context.reputation}</p>
                    </div>
                  </div>
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">Ranking</p>
                      <p className="title">{this.context.ranking}</p>
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

                {this.context.messages.length == 0 && (
                  <p>
                    You have no messages yet! Whenever you send or receive a
                    message it will appear here.
                  </p>
                )}
                {this.context.messages.length > 0 && (
                  <div className="container is-fluid">
                    <div className="columns">
                      <div className="column is-narrow">
                        <nav className="panel">
                          <p className="panel-heading">Conversations</p>
                          <div
                            style={{
                              maxHeight: "30em",
                              minHeight: "30em",
                              height: "30em",
                              overflow: "auto",
                            }}
                          >
                            {this.context.messages.map((message) => {
                              return (
                                <a
                                  key={`message-list-item-${message.id}`}
                                  className={
                                    this.context.viewingMessage &&
                                    message.id == this.context.viewingMessage.id
                                      ? "panel-block is-active"
                                      : "panel-block"
                                  }
                                  target={message.id}
                                  onClick={this.changeViewingMessage}
                                >
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

                      {this.context.viewingMessage && (
                        <>
                          <div className="column">
                            <article className="panel is-info">
                              <p className="panel-heading">
                                {this.context.viewingMessage.text}
                              </p>

                              <>
                                <div
                                  className="container is-fluid"
                                  style={{
                                    maxHeight: "30em",
                                    minHeight: "30em",
                                    height: "30em",
                                    overflow: "auto",
                                  }}
                                >
                                  <article
                                    key={`response-${this.context.viewingMessage.id}`}
                                    className="media"
                                  >
                                    <div className="media-content">
                                      <div className="content">
                                        <p>
                                          <strong>
                                            {this.context.viewingMessage
                                              .profile_id ==
                                            this.context.userInfo.id
                                              ? "Me"
                                              : "Someone"}
                                          </strong>{" "}
                                          <small>
                                            #
                                            {
                                              this.context.viewingMessage
                                                .profile_id
                                            }
                                          </small>{" "}
                                          <small>
                                            {new Date(
                                              this.context.viewingMessage.send_date
                                            ).toLocaleString()}
                                          </small>
                                          <br />
                                          {this.context.viewingMessage.text}
                                        </p>
                                      </div>
                                    </div>
                                  </article>
                                  {this.context.viewingMessage.responses.map(
                                    (response) => {
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
                                                  this.context.userInfo.id
                                                    ? "Me"
                                                    : "Someone"}
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
                                    }
                                  )}
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
                                    onClick={this.handleSendResponse}
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
}

export default Profile;
