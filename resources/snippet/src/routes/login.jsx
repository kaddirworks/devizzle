import React from "react";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Link from "../components/elements/link";
import Title from "../components/elements/title";
import Text from "../components/elements/text";
import Input from "../components/elements/input";
import Button from "../components/elements/button";
import Footer from "../components/footer";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Title>Login</Title>
          <div>
            <Text>Username</Text>
            <Input />
            <Text>Password</Text>
            <Input />
            <Button>Login</Button>
          </div>
          <div>
            <Text>
              Does not have an account? Create an account{" "}
              <Link dst={"/register"}>here</Link>.
            </Text>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Login;
