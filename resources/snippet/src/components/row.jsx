import React from "react";

import "./row.css";

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="Row">{this.props.children}</div>;
  }
}

export default Row;
