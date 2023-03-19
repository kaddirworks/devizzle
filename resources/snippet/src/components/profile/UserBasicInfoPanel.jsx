import React from "react";
import UserContext from "../../context/user";

class UserBasicInfoPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <>
        <nav className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Member Since</p>
              <p className="title">{this.context.dateRegistered}</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Messages Sent</p>
              <p className="title">{this.context.sentCount}</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Messages Received</p>
              <p className="title">{this.context.receivedCount}</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Reputation</p>
              <p className="title">{this.context.reputation}</p>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default UserBasicInfoPanel;
