import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = (token, userId, username, expiration) => {
    let exp = new Date(expiration).toUTCString();
    document.cookie = `access_token=${token}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `username=${username}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `user_id=${userId}; SameSite=Lax; expires=${exp}; Secure;`;
    navigate("/profile");
  };

  const onSubmit = (e) => {
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
            if (!res.ok) setError(JSON.stringify(data.detail));
            else
              handleLogin(
                data.access_token,
                data.user_id,
                data.username,
                data.expiration
              );
          },
          (err) => setError(JSON.stringify(err))
        );
      },
      (err) => setError(JSON.stringify(err))
    );
  };

  return (
    <div className="container is-fluid">
      <div className="content">
        <form className="box">
          <h1 className="title">Login</h1>

          {error && (
            <p className="tag is-danger is-medium" id="message">
              {error}
            </p>
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
            onClick={onSubmit}
            onSubmit={onSubmit}
          />
        </form>
        <p>
          Does not have an account? Sign up <Link to="/register">here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;
