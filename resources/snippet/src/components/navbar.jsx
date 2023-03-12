import React from "react";

import NavLink from "./elements/navlink";

import "./navbar.css";

function Navbar(props) {
  const username = document.cookie
    .split(";")
    .map((part) => {
      return part.trim();
    })
    .find((elem) => {
      return elem.startsWith("username=");
    })
    ?.split("=")[1];

  return (
    <div className="Navbar">
      <div className="Navbar-Title">Devizzle</div>
      <div className="Navbar-Links">
        <NavLink dst={"/"}>Home</NavLink>
        <NavLink dst={"/how-it-works"}>How it Works</NavLink>
        <NavLink dst={"/about"}>About</NavLink>
        {/* <NavLink dst={"/donate"}>Donate</NavLink> */}
        {username ? (
          <NavLink dst={"/profile"}>My Profile ({username})</NavLink>
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
