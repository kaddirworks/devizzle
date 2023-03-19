import React from "react";
import UserContext from "../../context/user";
import UserConversationHistoryItem from "./UserConversationHistoryItem";

class UserConversationHistoryPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  scrollChat() {
    let responsePadding = document.querySelector("#response-padding");
    responsePadding?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    }); // FIXME: sometimes this is null, why?
  }

  componentDidUpdate() {
    this.scrollChat();
  }

  componentDidMount() {
    // this.scrollChat();
  }

  render() {
    return (
      <article className="panel is-info">
        <p className="panel-heading">Someone #{this.context.viewingMessage.profile_id}</p>

        <div
          className="container is-fluid"
          style={{
            maxHeight: "30em",
            minHeight: "30em",
            height: "30em",
            overflow: "auto",
          }}
        >
          <UserConversationHistoryItem message={this.context.viewingMessage} />

          {this.context.viewingMessage.responses.map((response) => {
            return (
              <UserConversationHistoryItem
                key={`response-${response.id}`}
                message={response}
              />
            );
          })}

          {/* Padding */}
          <article
            className="media"
            key={`response-padding`}
            id="response-padding"
          >
            <div className="media-content">
              <div className="content">
                <p>
                  <br />
                </p>
              </div>
            </div>
          </article>
        </div>
      </article>
    );
  }
}

export default UserConversationHistoryPanel;
