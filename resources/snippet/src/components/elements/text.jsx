import React from "react";

import "./elements.css";

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="Text" style={this.props.style}>{this.props.children}</div>;
  }
}

export default Text;
