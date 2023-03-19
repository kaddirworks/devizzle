import React from "react";
import UserContext from "../../context/user";

class UserConversationHistoryItem extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <blockquote className="blockquote">
        <strong>
          {this.props.message.profile_id == this.context.userInfo.userId
            ? "Me"
            : "Someone"}
        </strong>
        <small> {new Date().toLocaleString()}</small>
        <p>{this.props.message.text}</p>
      </blockquote>
    );
  }
}

export default UserConversationHistoryItem;
