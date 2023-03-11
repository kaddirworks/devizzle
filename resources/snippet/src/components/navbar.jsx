import React from "react";

import NavLink from "./elements/navlink";

import "./navbar.css";

function Navbar(props) {
  return (
    <div className="Navbar">
      <div className="Navbar-Title">Devizzle</div>
      <div className="Navbar-Links">
        <NavLink dst={"/"}>Home</NavLink>
        <NavLink dst={"/how-it-works"}>How it Works</NavLink>
        <NavLink dst={"/about"}>About</NavLink>
        {/* <NavLink dst={"/donate"}>Donate</NavLink> */}
        {props.user ? (
          <NavLink dst={"/profile"}>My Profile ({props.user.username})</NavLink>
        ) : (
          <>
            <NavLink dst={"/login"}>Login</NavLink>
            <NavLink dst={"/register"}>Register</NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
