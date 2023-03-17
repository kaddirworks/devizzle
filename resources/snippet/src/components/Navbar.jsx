import React from "react";

import { NavLink } from "react-router-dom";

import UserContext from "../context/user";

class Navbar extends React.Component {
  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ userInfo, setUserInfo }) => {
          return (
            <nav
              className="navbar"
              role="navigation"
              aria-label="main navigation"
            >
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
                  <NavLink className="navbar-item" to="/">
                    Home
                  </NavLink>
                  <NavLink className="navbar-item" to="/about">
                    About
                  </NavLink>
                </div>
                <div className="navbar-end">
                  <div className="navbar-item">
                    {userInfo && (
                      <div className="buttons">
                        <NavLink className="button is-primary" to="/profile">
                          My profile
                        </NavLink>
                        <NavLink className="button is-light" to="/signout">
                          Sign out
                        </NavLink>
                      </div>
                    )}
                    {!userInfo && (
                      <div className="buttons">
                        <NavLink className="button is-primary" to="/register">
                          <strong>Sign up</strong>
                        </NavLink>
                        <NavLink className="button is-light" to="/login">
                          Log in
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

function withNavBar(component) {
  return (
    <div>
      <Navbar />
      {component}
    </div>
  );
}

export { withNavBar };

export default Navbar;
