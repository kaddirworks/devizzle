import React from "react";
import { useLoaderData } from "react-router-dom";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Column from "../components/column";
import Title from "../components/elements/title";
import Input from "../components/elements/input";
import Button from "../components/elements/button";
import Message, { MessageContainer } from "../components/message";
import Footer from "../components/footer";
import TextArea from "../components/elements/text_area";
import Row from "../components/row";

const conversationLoader = ({ params }) => {
  let messages = [];
  let amount = Math.floor(Math.random() * 101);

  for (let i = 0; i < amount; i++) {
    messages.push({
      text: `This function is a valid React component because it accepts a single “props” (which stands for properties) object argument with data and returns a React element. We call such components “function components” because they are literally JavaScript functions #${i}`,
      sender: Math.random() < 0.5 ? "me" : "them",
    });
  }

  return {
    conversationId: params.conversationId,
    messages,
  };
};

const Conversation = () => {
  const { conversationId, messages } = useLoaderData();
  return (
    <div>
      <Navbar />
      <Container>
        <Title>Viewing Conversation #{conversationId}</Title>

        <MessageContainer>
          {messages.map((message) => {
            return <Message text={message.text} sender={message.sender} />;
          })}
        </MessageContainer>

        <TextArea placeholder="Type something..."></TextArea>
        <Button>Send Reply</Button>
      </Container>
      <Footer />
    </div>
  );
};

// class Conversation extends React.Component {
//   constructor(props) {
//     super(props);
//     this.props = props;
//   }

//   render() {}
// }

export { conversationLoader };

export default Conversation;
