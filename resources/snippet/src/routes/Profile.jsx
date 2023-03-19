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
        <section className="section">
          <p>Loading...</p>
        </section>
      );

    if (this.context.mustRelogin) return <Navigate to="/login" />;

    return (
      <>
        <div className="container">
          <div className="content">
            <section className="section">
              <h1>
                Welcome back, <strong>{this.context.userInfo.username}</strong>!
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Exercitationem at beatae, molestiae, ea distinctio similique,
                deleniti esse et temporibus cum provident accusamus laborum
                natus ratione ipsam rem blanditiis corrupti itaque.
              </p>
              <UserMessagesPanel />
            </section>
            <section className="section">
              <UserBasicInfoPanel />
            </section>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
