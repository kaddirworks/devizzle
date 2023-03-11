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

import "./profile.css";

function MessagesSectionTitle(props) {
  return <div className="MessagesSectionTitle">{props.children}</div>;
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.profileInfo = {
      sentCount: Math.floor(Math.random() * 101),
      receivedCount: Math.floor(Math.random() * 101),
      reputation: Math.floor(Math.random() * 101),
      ranking: Math.floor(Math.random() * 10001),
    };
    this.messages = [];

    for (let i = 0; i < 20; i++) {
      let responses = [];

      for (let j = 5; j > 0; j--) {
        responses.push(`Response #${j}`);
      }

      this.messages.push({
        conversationId: Math.floor(Math.random() * 99999999),
        text: `Message #${i}`,
        hasUnreadMessages: Math.random() < 0.4,
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
              <Text>Registered: {new Date().toDateString()}</Text>
              <Text>Sent: {this.profileInfo.sentCount}</Text>
              <Text>Received: {this.profileInfo.receivedCount}</Text>
            </Column>
            <Column>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Reputation: {this.profileInfo.reputation}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Global Ranking: #{this.profileInfo.ranking}
              </Text>
            </Column>
          </Row>

          <MessagesSectionTitle>
            <SectionTitle>Messages</SectionTitle>
            <Link dst={"write"}>New Message</Link>
          </MessagesSectionTitle>
          <Column>
            {this.messages.map((message) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "0.8em",
                  }}
                >
                  <Column>
                    <Link
                      dst={`/profile/conversations/${message.conversationId}`}
                    >
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: message.hasUnreadMessages ? "bolder" : "",
                        }}
                      >
                        Conversation {message.conversationId}{" "}
                        {message.hasUnreadMessages ? " *" : ""}
                      </div>
                    </Link>
                  </Column>
                  <Column>
                    <Text>Last Reply - {new Date().toDateString()}</Text>
                  </Column>
                </div>
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
