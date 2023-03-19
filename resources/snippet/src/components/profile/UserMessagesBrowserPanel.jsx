import React from "react";
import UserContext from "../../context/user";

class UserMessagesBrowserPanel extends React.Component {
  static contextType = UserContext;

  constructor({ props }) {
    super(props);

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.changeViewingMessage = this.changeViewingMessage.bind(this);
  }

  handleLoadMore() {
    alert("Loading more messages");
  }

  changeViewingMessage(e) {
    e.preventDefault();

    this.context.set({
      viewingMessage: this.context.messages.find(
        (elem) => elem.id == Number.parseInt(e.target.target)
      ),
    });
  }

  render() {
    return (
      <nav className="panel">
        <p className="panel-heading">Conversations</p>
        <div
          style={{
            maxHeight: "30em",
            minHeight: "30em",
            height: "30em",
            overflow: "auto",
          }}
        >
          {this.context.messages.map((message) => {
            return (
              <a
                key={`message-list-item-${message.id}`}
                className={
                  this.context.viewingMessage &&
                  message.id == this.context.viewingMessage.id
                    ? "panel-block is-active"
                    : "panel-block"
                }
                target={message.id}
                onClick={this.changeViewingMessage}
              >
                <span className="panel-icon">
                  <i className="fa-solid fa-comment"></i>
                </span>
                Someone #{message.profile_id}
              </a>
            );
          })}
        </div>
        <div className="panel-block">
          <button
            className="button is-link is-fullwidth"
            onClick={this.handleLoadMore}
          >
            Load More
          </button>
        </div>
      </nav>
    );
  }
}

export default UserMessagesBrowserPanel;
