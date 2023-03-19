import React from "react";

import { NavLink } from "react-router-dom";

import UserContext from "../context/user";

class Navbar extends React.Component {
  constructor({ props }) {
    super(props);
  }

  componentDidMount() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll(".navbar-burger"),
      0
    );

    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ userInfo, setUserInfo }) => {
          return (
            <nav
              className="navbar is-link"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <NavLink className="navbar-item" to="/">
                  <strong>Devizzle</strong>
                </NavLink>
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
                  {/* <NavLink className="navbar-item" to="/">
                    Home
                  </NavLink> */}
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

export default Navbar;
