import React from "react";

import "./elements.css";

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <textarea className="TextArea" placeholder={this.props.placeholder}>
        {this.props.children}
      </textarea>
    );
  }
}

export default TextArea;
