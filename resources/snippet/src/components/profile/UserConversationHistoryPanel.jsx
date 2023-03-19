import React from "react";
import UserContext from "../../context/user";
import UserConversationHistoryItem from "./UserConversationHistoryItem";

class UserConversationHistoryPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  scrollChat() {
    let historyPanel = document.querySelector("#history-panel");
    historyPanel.scroll({
      top: historyPanel.scrollHeight,
      behavior: "smooth",
    });
  }

  componentDidUpdate() {
    this.scrollChat();
  }

  componentDidMount() {
    this.scrollChat();
  }

  render() {
    return (
      <article className="panel is-info">
        <p className="panel-heading">
          Someone #{this.context.viewingMessage.profile_id}
        </p>

        <div
          className="container is-fluid"
          style={{
            maxHeight: "30em",
            minHeight: "30em",
            height: "30em",
            overflow: "auto",
          }}
          id="history-panel"
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

          <p key={"response-padding"} id="response-padding"></p>
        </div>
      </article>
    );
  }
}

export default UserConversationHistoryPanel;
