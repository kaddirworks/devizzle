import React from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/user";
import UserConversationHistoryPanel from "./UserConversationHistoryPanel";
import UserConversationReplyForm from "./UserConversationReplyForm";
import UserMessagesBrowserPanel from "./UserMessagesBrowserPanel";

class UserMessagesPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <>
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
            You have no messages yet! Whenever you send or receive a message it
            will appear here.
          </p>
        )}

        {this.context.messages.length > 0 && (
          <div className="container is-fluid">
            <div className="columns">
              <div className="column is-narrow">
                <UserMessagesBrowserPanel />
              </div>

              <div className="column">
                <UserConversationHistoryPanel />
                <UserConversationReplyForm />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default UserMessagesPanel;
