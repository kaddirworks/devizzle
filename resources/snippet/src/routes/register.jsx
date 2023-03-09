import React from "react";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Link from "../components/elements/link";
import Title from "../components/elements/title";
import Text from "../components/elements/text";
import Input from "../components/elements/input";
import Button from "../components/elements/button";
import Footer from "../components/footer";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <div
            style={{
              width: "50%",
              margin: "auto",

              display: "flex",
              flexDirection: "column",
              rowGap: "1em",
            }}
          >
            <Title>Register</Title>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.5em",
              }}
            >
              <Text>Username</Text>
              <Input />
              <Text>Email</Text>
              <Input />
              <Text>Password</Text>
              <Input />
              <Text>Confirm Password</Text>
              <Input />
              <Button>Submit</Button>
            </div>
            <div>
              <Text>
                Already have an account? Click <Link dst={"/login"}>here</Link>{" "}
                to login.
              </Text>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Register;
