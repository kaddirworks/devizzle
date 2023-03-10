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
          <div
            style={{
              maxWidth: "50em",
              margin: "auto",

              display: "flex",
              flexDirection: "column",
              rowGap: "1em",
            }}
          >
            <Title>Login</Title>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.5em",
              }}
            >
              <Text>Username</Text>
              <Input type={"text"} />
              <Text>Password</Text>
              <Input type={"password"} />
              <Button>Submit</Button>
            </div>
            <div>
              <Text>
                Does not have an account? Create an account{" "}
                <Link dst={"/register"}>here</Link>.
              </Text>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Login;
