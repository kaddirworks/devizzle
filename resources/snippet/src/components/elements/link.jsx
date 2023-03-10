import React from "react";

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <a href={this.props.dst} className="Link">{this.props.children}</a>;
  }
}

export default Link;
