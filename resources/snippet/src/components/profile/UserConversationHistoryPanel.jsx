import React from "react";
import UserContext from "../../context/user";
import UserConversationHistoryItem from "./UserConversationHistoryItem";
import UserConversationReplyForm from "./UserConversationReplyForm";

class UserConversationHistoryPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  scrollChat() {
    let historyPanel = document.querySelector("#history-panel");
    historyPanel?.scroll({
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
      <div className="tile is-vertical is-8">
        <div className="tile is-parent">
          <article className="tile is-child">
            <p className="title">
              History
            </p>
            <div
              style={{
                maxHeight: "30em",
                minHeight: "30em",
                height: "30em",
                overflow: "auto",
              }}
              id="history-panel"
            >
              <UserConversationHistoryItem
                message={this.context.viewingMessage}
              />
              {this.context.viewingMessage.responses.map((response) => {
                return (
                  <UserConversationHistoryItem
                    key={`response-${response.id}`}
                    message={response}
                  />
                );
              })}
            </div>
            <UserConversationReplyForm />
          </article>
        </div>
      </div>
    );
  }
}

export default UserConversationHistoryPanel;
