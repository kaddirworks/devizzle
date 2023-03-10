import React from "react";

import "./column.css";

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="Column">{this.props.children}</div>;
  }
}

export default Column;
