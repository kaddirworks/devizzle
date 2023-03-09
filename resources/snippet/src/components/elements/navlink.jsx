import React from "react";

import { NavLink as NL } from "react-router-dom";

import "./elements.css";

class NavLink extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <NL to={this.props.dst} className="NavLink">
        {this.props.children}
      </NL>
    );
  }
}

export default NavLink;
