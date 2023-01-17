function handleError(statusCode) {
  const usertoken = localStorage.getItem("userToken");
  if ([401, 403].includes(statusCode)) {
    location.reload();
    localStorage.removeItem("userToken");
    console.log("Logging out...");
  }
}

export default handleError;
