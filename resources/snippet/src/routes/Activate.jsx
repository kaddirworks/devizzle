import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import client from "../client";

function Activate() {
  const { secretCode } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (token, user_id, username, expiration) => {
    let exp = new Date(expiration).toUTCString();
    document.cookie = `access_token=${token}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `user_id=${user_id}; SameSite=Lax; expires=${exp}; Secure;`;
    document.cookie = `username=${username}; SameSite=Lax; expires=${exp}; Secure;`;
    navigate("/profile");
  };

  useEffect(() => {
    if (!result) {
      client.get(
        "/auth/activate/" + secretCode,
        {},
        (data) => {
          setResult("Your account was activated!");
          setTimeout(() => {
            handleLogin(
              data.access_token,
              data.user_id,
              data.username,
              data.expiration
            );
          }, 2000);
        },
        (error) => {
          setResult(error.data.detail);
        }
      );
    }
  }, [result]);

  return (
    <section className="section">
      <div className="box">
        {!result && <h1>Activating...</h1>}
        {result && (
          <>
            <h1>{result}</h1>
            <p>
              You can now go to your <Link to="/profile">profile</Link>.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default Activate;
