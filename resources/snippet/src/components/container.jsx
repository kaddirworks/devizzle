import React from "react";

import "./container.css"

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="Container">{this.props.children}</div>;
  }
}

export default Container;
