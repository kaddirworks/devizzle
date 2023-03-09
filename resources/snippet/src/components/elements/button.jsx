import React from "react";

import "./elements.css";

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <button className="Button">{this.props.children}</button>;
  }
}

export default Button;
