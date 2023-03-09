import React from "react";

import "./elements.css";

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="Title">{this.props.children}</div>;
  }
}

export default Title;
