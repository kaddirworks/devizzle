import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserContext from "./context/user";

import Home from "./routes/Home";
import About from "./routes/About";
import Login from "./routes/Login";
import Register from "./routes/Register";
import SignOut from "./routes/SignOut";
import Profile from "./routes/Profile";
import Write from "./routes/Write";
import Activate from "./routes/Activate";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import client from "./client";

const decorated = (Component) => {
  return (
    <>
      <Navbar />
      <div className="container is-fluid">
        <div className="content">{Component}</div>
      </div>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: decorated(<Home />),
  },
  {
    path: "/about",
    element: decorated(<About />),
  },
  {
    path: "/login",
    element: decorated(<Login />),
  },
  {
    path: "/register",
    element: decorated(<Register />),
  },
  {
    path: "/signout",
    element: decorated(<SignOut />),
  },
  {
    path: "/activate/:secretCode",
    element: decorated(<Activate />),
  },
  {
    path: "/profile",
    element: decorated(<Profile />),
  },
  {
    path: "/write",
    element: decorated(<Write />),
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

    this.handle401 = this.handle401.bind(this);
    this.loadMoreConversations = this.loadMoreConversations.bind(this);

    this.state = {
      error: null,
      userInfo: null,
      messages: [],
      offset: 0,
      setUserInfo: this.setUserInfo,
      handle401: this.handle401,
      loadMoreConversations: this.loadMoreConversations,
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

  loadMoreConversations() {
    client.get(
      `/bottles/my-messages?skip=${this.state.offset}&limit=5`,
      {},
      (res) => {
        let data = res.data;
        this.setState({ messages: this.state.messages.concat(data) });
      },
      (error) => {
        if (error.code == 401) this.handle401();
        else this.setError(error.data.message);
      }
    );
    this.setState({ offset: this.state.offset + 5 });
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
      userId: Number.parseInt(userId),
      accessToken,
    });

    client.get(
      "/bottles/profile",
      {},
      (res) => {
        let data = res.data;
        this.setState({
          dateRegistered: new Date(data.date_created).toLocaleDateString(),
          sentCount: data.sent_count,
          receivedCount: data.received_count,
          reputation: data.reputation,
          ranking: data.ranking,
        });
      },
      (error) => {
        if (error.code == 401) this.handle401();
        else this.setError(error.data.message);
      }
    );
    client.get("/bottles/receive");
    client.get(
      `/bottles/my-messages?limit=5`,
      {},
      (res) => {
        let data = res.data;
        this.setState({ messages: data });
        this.setState({ viewingMessage: data[0] });
      },
      (error) => {
        if (error.code == 401) this.handle401();
        else this.setError(error.data.message);
      }
    );
    this.setState({ offset: this.state.offset + 5 });
  }

  render() {
    return (
      <>
        {this.state.error && <h1>{this.state.error}</h1>}
        {!this.state.error && (
          <UserContext.Provider value={this.state}>
            <RouterProvider router={router} />
          </UserContext.Provider>
        )}
      </>
    );
  }
}

export default App;
