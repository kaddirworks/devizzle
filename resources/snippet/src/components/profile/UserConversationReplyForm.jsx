import React from "react";
import UserContext from "../../context/user";

class UserConversationReplyForm extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
    this.handleSendResponse = this.handleSendResponse.bind(this);
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

  render() {
    return (
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
    );
  }
}

export default UserConversationReplyForm;
