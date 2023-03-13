import React, { useState } from "react";

function Write() {
  const access_token = document.cookie
    .split(";")
    .map((elem) => elem.trim())
    .find((elem) => elem.startsWith("access_token="))
    ?.split("=")[1];

  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    let form = document.forms[0];
    let message = new FormData(form).get("message");
    let body = JSON.stringify({
      message,
    });

    fetch("http://localhost:8000/bottles/send", {
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok) setResult(data.detail);
            else setResult("Your message was sent!");
          },
          (err) => setResult(JSON.stringify(err))
        );
      },
      (err) => setResult(JSON.stringify(err))
    );
  }

  return (
    <div className="container is-fluid">
      <div className="content">
        {result && <h1>{result}</h1>}
        {!result && (
          <>
            <h1>Write a New Message</h1>
            <form>
              <div className="field">
                <textarea
                  name="message"
                  id="message"
                  className="textarea"
                  placeholder="Type something..."
                ></textarea>
              </div>
              <input
                className="button is-primary"
                type="submit"
                value="Send"
                onClick={handleSubmit}
                onSubmit={handleSubmit}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Write;
