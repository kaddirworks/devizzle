import Column from "./column";
import Text from "./elements/text";
import Row from "./row";

import "./message.css";

function MessageContainer(props) {
  return <div className="MessageContainer">{props.children}</div>;
}

function Message(props) {
  return (
    <div className={props.sender == "me" ? "Message Mine" : "Message NotMine"}>
      <Row>
        <Column>
          <Text>{props.text}</Text>
          <p className="MessageDateTime">{new Date().toLocaleString()}</p>
        </Column>
      </Row>
    </div>
  );
}

export { MessageContainer };

export default Message;
