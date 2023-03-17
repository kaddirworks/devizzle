import React from "react";

import { Link, Navigate } from "react-router-dom";

import UserContext from "../context/user";

class Login extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);
    this.state = {
      userInfo: null,
      error: null,
    };

    this.setError = (err) => {
      this.setState({ error: err });
    };

    this.handleLogin = (accessToken, userId, username, expiration) => {
      let exp = new Date(expiration).toUTCString();
      document.cookie = `access_token=${accessToken}; SameSite=Lax; expires=${exp}; Secure;`;
      document.cookie = `username=${username}; SameSite=Lax; expires=${exp}; Secure;`;
      document.cookie = `user_id=${userId}; SameSite=Lax; expires=${exp}; Secure;`;

      this.context.setUserInfo({ username, accessToken: accessToken, userId });
    };

    this.onSubmit = (e) => {
      e.preventDefault();

      let form = document.forms[0];
      let formData = new FormData(form);

      fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: formData,
      }).then(
        (res) => {
          res.json().then(
            (data) => {
              if (!res.ok) this.setError(JSON.stringify(data.detail));
              else
                this.handleLogin(
                  data.access_token,
                  data.user_id,
                  data.username,
                  data.expiration
                );
            },
            (err) => this.setError(JSON.stringify(err))
          );
        },
        (err) => this.setError(JSON.stringify(err))
      );
    };
  }

  render() {
    return (
      <div className="container is-fluid">
        <div className="content">
          <form className="box">
            <h1 className="title">Login</h1>

            {this.state.error && (
              <p className="tag is-danger is-medium" id="message">
                {this.state.error}
              </p>
            )}

            {this.context.userInfo && !this.context.mustRelogin && (
              <Navigate to="/profile" />
            )}

            <div className="field">
              <input
                className="input"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
            </div>
            <div className="field">
              <input
                className="input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <input
              className="button is-primary"
              type="submit"
              value="Submit"
              onClick={this.onSubmit}
              onSubmit={this.onSubmit}
            />
          </form>
          <p>
            Does not have an account? Sign up <Link to="/register">here</Link>.
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
