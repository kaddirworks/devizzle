import React, { useEffect, useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./routes/home";
import HowItWorks from "./routes/how-it-works";
import About from "./routes/about";
import Donate from "./routes/donate";
import Login from "./routes/login";
import Register from "./routes/register";
import SignOut from "./routes/signout";
import Profile from "./routes/profile";
import Write from "./routes/write";
import Activate from "./routes/activate";
import withUserInfo from "./client/userInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/donate",
    element: <Donate />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/signout",
    element: <SignOut />,
  },
  {
    path: "/activate/:secretCode",
    element: <Activate />,
  },
  {
    path: "/profile",
    element: withUserInfo(<Profile />),
  },
  {
    path: "/write",
    element: withUserInfo(<Write />),
  },
]);

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const access_token = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("access_token="))
      ?.split("=")[1];
    const username = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("username="))
      ?.split("=")[1];
    const user_id = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("user_id="))
      ?.split("=")[1];

    if (!access_token || !username || !user_id) setUserData(null);
    else
      setUserData({
        access_token,
        username,
        user_id,
      });
  }, []);

  return (
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <img
              src="https://bulma.io/images/bulma-logo.png"
              width="112"
              height="28"
            />
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item" href="/">
              Home
            </a>
            <a className="navbar-item" href="/about">
              About
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {userData && (
                <div className="buttons">
                  <a className="button is-primary" href="/profile">
                    My profile
                  </a>
                  <a className="button is-light" href="/signout">
                    Sign out
                  </a>
                </div>
              )}
              {!userData && (
                <div className="buttons">
                  <a className="button is-primary" href="/register">
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light" href="/login">
                    Log in
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
