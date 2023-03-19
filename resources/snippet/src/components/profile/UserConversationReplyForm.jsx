import React from "react";
import UserContext from "../../context/user";

import client from "../../client";

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
    let body = {
      response,
      responding_to_id: this.context.viewingMessage.id,
    };

    client.post(
      "/bottles/respond",
      {
        "Content-Type": "application/json",
      },
      body,
      (res) => {
        let data = res.data;
        let newViewingMessage = { ...this.context.viewingMessage };
        newViewingMessage.responses.push(data);
        this.context.set({
          viewingMessage: newViewingMessage,
        });
        document.querySelector("#response").value = "";
      },
      (error) => {
        if (error.code == 401) this.context.handle401();
      }
    );
  }

  render() {
    return (
      <form className="column">
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Type something..."
              name="response"
              id="response"
            />
          </div>

          <div className="control">
            <button
              className="button is-primary"
              onClick={this.handleSendResponse}
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default UserConversationReplyForm;
