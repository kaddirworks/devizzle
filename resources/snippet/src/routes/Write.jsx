import React, { useState } from "react";
import UserContext from "../context/user";

class Write extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);

    this.state = {
      result: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setResult(result) {
    this.setState({ result });
  }

  handleSubmit(e) {
    e.preventDefault();

    let form = document.forms[0];
    let message = new FormData(form).get("message");
    let body = JSON.stringify({
      message,
    });

    fetch("http://localhost:8000/bottles/send", {
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
            if (!res.ok) this.setResult(data.detail);
            else {
              this.setResult("Your message was sent!");
              this.context.messages.push({
                ...data,
                responses: [],
              });
            }
          },
          (err) => this.setResult(JSON.stringify(err))
        );
      },
      (err) => this.setResult(JSON.stringify(err))
    );
  }

  render() {
    return (
      <div className="container is-fluid">
        <div className="content">
          {this.state.result && <h1>{this.state.result}</h1>}
          {!this.state.result && (
            <>
              <h1>Write a New Message</h1>
              <form>
                <div className="field">
                  <textarea
                    name="message"
                    id="message"
                    className="textarea"
                    placeholder="Type something..."
                  ></textarea>
                </div>
                <input
                  className="button is-primary"
                  type="submit"
                  value="Send"
                  onClick={this.handleSubmit}
                  onSubmit={this.handleSubmit}
                />
              </form>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Write;
