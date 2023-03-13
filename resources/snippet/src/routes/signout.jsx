import { Navigate } from "react-router-dom";

function SignOut() {
  document.cookie = "access_token=;";
  document.cookie = "username=;";
  document.cookie = "user_id=;";
  return <Navigate to="/" />;
}

export default SignOut;
