import { Navigate } from "react-router-dom";

function withUserInfo(component) {
  const access_token = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("access_token="))
    ?.split("=")[1];
  const username = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("username="))
    ?.split("=")[1];
  const user_id = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("user_id="))
    ?.split("=")[1];

  if (
    access_token == undefined ||
    username == undefined ||
    user_id == undefined
  ) {
    return <Navigate to={"/login"} />;
  }
  return <>{component}</>;
}

export default withUserInfo;
