import React from "react";

import Text from "./elements/text";

import "./footer.css";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="Footer">
        <Text>
          Made with{" "}
          <span
            style={{
              color: "tomato",
            }}
          >
            <i className="fa-solid fa-heart"></i>
          </span>{" "}
          using FastAPI and React
        </Text>
      </div>
    );
  }
}

export default Footer;
