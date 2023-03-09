import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./routes/home";
import HowItWorks from "./routes/how-it-works";
import About from "./routes/about";
import Donate from "./routes/donate";
import Login from "./routes/login";
import Register from "./routes/register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/donate",
    element: <Donate />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <RouterProvider router={router} />;
  }
}

export default App;
