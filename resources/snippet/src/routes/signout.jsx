import React from "react";

import { Navigate } from "react-router-dom";

import UserContext from "../context/user";

class SignOut extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
    this.state = {
      done: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      document.cookie = "access_token=;";
      document.cookie = "username=;";
      document.cookie = "user_id=;";
      this.context.setUserInfo(null);
      this.setState({ done: true });
    }, 3000);
  }

  render() {
    return (
      <div className="container is-fluid">
        <div className="content">
          <h1>Signing Off...</h1>
          {this.state.done && <Navigate to="/" />}
        </div>
      </div>
    );
  }
}

export default SignOut;
