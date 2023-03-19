class Client {
  constructor() {
    let accessToken = document.cookie
      .split(";")
      .map((elem) => elem.trim())
      .find((elem) => elem.startsWith("access_token="))
      ?.split("=")[1];

    this.apiBaseUrl = import.meta.env["VITE_API_SERVER_ADDRESS"];
    this.defaultHeaders = {
      Authorization: "Bearer " + accessToken,
    };
  }

  _makeRequest(
    info = {},
    suffix = "/",
    headers = {},
    onResult = (data) => {},
    onError = (error) => {}
  ) {
    // TODO: this is rubbish
    let body = info["body"];

    if (info.method === "GET") {
      body = null;
    }

    if (body) {
      if (!(body instanceof FormData)) {
        body = JSON.stringify(body);
      }
    }

    fetch(this.apiBaseUrl + suffix, {
      method: info["method"],
      body,
      headers: {
        ...(headers || {}),
        ...this.defaultHeaders,
      },
    }).then(
      (res) => {
        res.json().then(
          (data) => {
            if (!res.ok)
              onError({
                code: res.status,
                data,
              });
            else
              onResult({
                code: res.status,
                data,
              });
          },
          (error) => {
            onError({
              data: {
                message: error.message,
              },
            });
          }
        );
      },
      (error) => {
        onError({
          data: {
            message: error.message,
          },
        });
      }
    );
  }

  get(
    suffix = "/",
    headers = {},
    onResult = (data) => {},
    onError = (error) => {}
  ) {
    this._makeRequest(
      {
        method: "GET",
        body: null,
      },
      suffix,
      headers,
      onResult,
      onError
    );
  }

  post(
    suffix = "/",
    headers = {},
    body = {},
    onResult = (data) => {},
    onError = (error) => {}
  ) {
    this._makeRequest(
      {
        method: "POST",
        body: body,
      },
      suffix,
      headers,
      onResult,
      onError
    );
  }
}

export default Client;
