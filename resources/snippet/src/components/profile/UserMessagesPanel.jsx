import React from "react";
import UserContext from "../../context/user";
import UserConversationHistoryPanel from "./UserConversationHistoryPanel";
import UserMessagesBrowserPanel from "./UserMessagesBrowserPanel";

class UserMessagesPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <>
        {this.context.messages.length == 0 && (
          <p>
            You have no messages yet! Whenever you send or receive a message it
            will appear here.
          </p>
        )}

        {this.context.messages.length > 0 && (
          <div className="tile is-ancestor">
            <UserMessagesBrowserPanel />
            <UserConversationHistoryPanel />
          </div>
        )}
      </>
    );
  }
}

export default UserMessagesPanel;
