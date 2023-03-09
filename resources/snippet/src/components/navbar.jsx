import React from "react";

import NavLink from "./elements/navlink";

import "./navbar.css";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.user = null;
  }

  render() {
    return (
      <div className="Navbar">
        <div className="Navbar-Title">Message in a Bottle</div>
        <div className="Navbar-Links">
          <NavLink dst={"/"}>Home</NavLink>
          <NavLink dst={"/how-it-works"}>How it Works</NavLink>
          <NavLink dst={"/about"}>About</NavLink>
          <NavLink dst={"/donate"}>Donate</NavLink>
          {this.user ? (
            this.user.username
          ) : (
            <span>
              <NavLink dst={"/login"}>Login</NavLink> or{" "}
              <NavLink dst={"/register"}>Register</NavLink>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Navbar;
