import React from "react";

import { Navigate } from "react-router-dom";
import UserBasicInfoPanel from "../components/profile/UserBasicInfoPanel";
import UserMessagesPanel from "../components/profile/UserMessagesPanel";

import UserContext from "../context/user";

class Profile extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
  }

  render() {
    if (!this.context.userInfo)
      return (
        <div className="container is-fluid">
          <div className="content">
            <p>Loading...</p>
          </div>
        </div>
      );

    if (this.context.mustRelogin) return <Navigate to="/login" />;

    return (
      <div className="container is-fluid">
        <div className="content">
          <h1>
            Welcome back, <strong>{this.context.userInfo.username}</strong>!
          </h1>

          <UserBasicInfoPanel />
          <UserMessagesPanel />
        </div>

        <div
          className="container"
          style={{
            marginBottom: "10em",
          }}
        ></div>
      </div>
    );
  }
}

export default Profile;
