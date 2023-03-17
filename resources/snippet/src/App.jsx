import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserContext from "./context/user";

import Home from "./routes/home";
import About from "./routes/about";
import Login from "./routes/login";
import Register from "./routes/register";
import SignOut from "./routes/signout";
import Profile from "./routes/profile";
import Write from "./routes/write";
import Activate from "./routes/activate";

import { withNavBar } from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: withNavBar(<Home />),
  },
  {
    path: "/about",
    element: withNavBar(<About />),
  },
  {
    path: "/login",
    element: withNavBar(<Login />),
  },
  {
    path: "/register",
    element: withNavBar(<Register />),
  },
  {
    path: "/signout",
    element: withNavBar(<SignOut />),
  },
  {
    path: "/activate/:secretCode",
    element: withNavBar(<Activate />),
  },
  {
    path: "/profile",
    element: withNavBar(<Profile />),
  },
  {
    path: "/write",
    element: withNavBar(<Write />),
  },
]);

class App extends React.Component {
  constructor({ props }) {
    super(props);

    this.setUserInfo = (userInfo) => {
      this.setState({
        userInfo,
      });
    };

    this.set = (data) => {
      this.setState(data);
    };

    this.state = {
      error: null,
      userInfo: null,
      messages: [],
      setUserInfo: this.setUserInfo,
      set: this.set,
    };
  }

  setError(error) {
    this.setState({ error });
  }

  handle401() {
    this.setState({
      mustRelogin: true,
    });
    this.setUserInfo(null);
  }

  componentDidMount() {
    let accessToken = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("access_token="))
      ?.split("=")[1];
    let username = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("username="))
      ?.split("=")[1];
    let userId = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("user_id="))
      ?.split("=")[1];

    if (!(username && userId && accessToken)) {
      this.setUserInfo(null);
      return;
    }

    this.setUserInfo({
      username,
      userId,
      accessToken,
    });

    // try to get the profile info
    fetch("http://localhost:8000/bottles/profile", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) {
              if (res.status == 401) this.handle401();
              else setError(data.detail);
            } else {
              this.setState({
                dateRegistered: new Date(
                  data.date_created
                ).toLocaleDateString(),
                sentCount: data.sent_count,
                receivedCount: data.received_count,
                reputation: data.reputation,
                ranking: data.ranking,
              });
              this.setState({ messages: data.messages });
            }
          },
          (err) => this.setError(JSON.stringify(err))
        );
      },
      (err) => this.setError(JSON.stringify(err))
    );

    // try to add new message
    fetch("http://localhost:8000/bottles/receive", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then(
      (res) => {
        if (res.status == 401) this.handle401();
      },
      (err) => this.setError(JSON.stringify(err))
    );

    // try to get the messages
    fetch("http://localhost:8000/bottles/my-messages", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) {
              if (res.status == 401) this.handle401();
              else this.setError(data.detail);
            }
            this.setState({ messages: data });
            this.setState({ viewingMessage: data[0] });
          },
          (err) => this.setError(JSON.stringify(err))
        );
        // do nothing, the message was added in the background
      },
      (err) => this.setError(JSON.stringify(err))
    );
  }

  render() {
    return (
      <>
        <div className="container is-fluid">
          <div className="content">
            {this.state.error && <h1>{this.state.error}</h1>}
            {!this.state.error && (
              <UserContext.Provider value={this.state}>
                <RouterProvider router={router} />
              </UserContext.Provider>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
