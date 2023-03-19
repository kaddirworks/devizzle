import React from "react";

import { Link, Navigate } from "react-router-dom";

import UserContext from "../context/user";
import client from "../client";

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

      client.post(
        "/auth/login",
        {},
        formData,
        (res) => {
          let data = res.data;
          this.handleLogin(
            data.access_token,
            data.user_id,
            data.username,
            data.expiration
          );
        },
        (error) => {
          this.setError(error.data.detail.msg);
        }
      );
    };
  }

  render() {
    return (
      <section className="section">
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
      </section>
    );
  }
}

export default Login;
