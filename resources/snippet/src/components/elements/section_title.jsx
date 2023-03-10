import React from "react";

import "./elements.css";

class SectionTitle extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="SectionTitle">{this.props.children}</div>;
  }
}

export default SectionTitle;
