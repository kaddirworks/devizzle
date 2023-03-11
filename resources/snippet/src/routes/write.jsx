import React from "react";

import { ApiClient, HomeApi, BottlesApi } from "devizzle-api";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Title from "../components/elements/title";
import TextArea from "../components/elements/text_area";
import Button from "../components/elements/button";
import Footer from "../components/footer";

class Write extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    new HomeApi().homeGet((error, data, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    });

    return (
      <div>
        <Navbar />
        <Container>
          <Title>New Message</Title>

          <TextArea placeholder="Type something..."></TextArea>
          <Button>Send</Button>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Write;
