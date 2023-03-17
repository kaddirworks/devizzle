import React from "react";

const UserContext = React.createContext({
  userInfo: null,
  setUserInfo: null,
});

export default UserContext;
