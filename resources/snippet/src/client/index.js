function getClientSpec() {
  return {
    apiServerAddress: import.meta.env["VITE_API_SERVER_ADDRESS"],
  };
}

export default getClientSpec;
