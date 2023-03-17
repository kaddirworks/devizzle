import React from "react";
import UserContext from "../../context/user";

class UserConversationHistoryItem extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <strong>
                {this.props.message.profile_id == this.context.userInfo.userId
                  ? "Me"
                  : "Someone"}
              </strong>{" "}
              <small>#{this.props.message.profile_id}</small>{" "}
              <small>
                {new Date(this.props.message.send_date).toLocaleString()}
              </small>
              <br />
              {this.props.message.text}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default UserConversationHistoryItem;
