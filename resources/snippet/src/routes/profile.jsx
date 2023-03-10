import React from "react";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Column from "../components/column";
import Row from "../components/row";
import Title from "../components/elements/title";
import SectionTitle from "../components/elements/section_title";
import Text from "../components/elements/text";
import Footer from "../components/footer";
import Button from "../components/elements/button";
import Link from "../components/elements/link";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.messages = [];

    for (let i = 0; i < 20; i++) {
      let responses = [];

      for (let j = 5; j > 0; j--) {
        responses.push(`Response #${j}`);
      }

      this.messages.push({
        text: `Message #${i}`,
        responses,
      });
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Title>My Profile</Title>

          <SectionTitle>Stats</SectionTitle>
          <Row>
            <Column>
              <Text>Registered: {Date()}</Text>
              <Text>Sent: {Math.floor(Math.random() * 101)}</Text>
              <Text>Received: {Math.floor(Math.random() * 101)}</Text>
            </Column>
            <Column>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Reputation: {Math.floor(Math.random() * 101)}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Global Ranking: #{Math.floor(Math.random() * 10001)}
              </Text>
            </Column>
          </Row>

          <SectionTitle>Messages</SectionTitle>
          <Column>
            {this.messages.map((message) => {
              return (
                <Row>
                  <Column>
                    <Link
                      dst={`/profile/conversations/${Math.floor(
                        Math.random() * 999999
                      )}`}
                    >
                      {Math.random() < 0.2 ? (
                        <span
                          style={{
                            color: "rgb(42, 49, 89)",
                          }}
                        >
                          <i className="fa-solid fa-comment-dots fa-shake"></i> 
                        </span>
                      ) : (
                        ""
                      )}
                      {message.text}
                    </Link>
                  </Column>
                  <Column>
                    <Text>Last Reply - {new Date().toISOString()}</Text>
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Button disabled>Previous Page</Button>
              <Button>Next Page</Button>
            </Row>
          </Column>

          <Button>Log out</Button>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Profile;
