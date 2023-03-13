import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Activate() {
  const { secretCode } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState("Waiting...");

  const handleLogin = (token, user_id, username, expiration) => {
    let exp = new Date(expiration).toUTCString();
    document.cookie = `access_token=${token}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `user_id=${user_id}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `username=${username}; SameSite=Lax; expires=${exp}; Secure;`;
    navigate("/profile");
  };

  useEffect(() => {
    fetch("http://localhost:8000/auth/activate/" + secretCode).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) setResult("Error: " + data.detail);
            else {
              handleLogin(
                data.access_token,
                data.user_id,
                data.username,
                data.expiration
              );
              setResult("Your account was successfully activated!");

              setTimeout(() => {
                navigate("/profile");
              }, 5000);
            }
          },
          (err) => setResult("Error: " + JSON.stringify(err))
        );
      },
      (err) => setResult("Error: " + JSON.stringify(err))
    );
  }, []);

  return (
    <div className="container is-fluid">
      <div className="content">
        <div className="box">
          <h1>{result}</h1>
          <p>
            You can now go to your <Link to="/profile">profile</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Activate;
