import { getRoot } from "../api";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

function Homepage() {
  const [apiVersion, setApiVersion] = useState<string>("");

  useEffect(() => {
    getRoot()
      .then((response) => {
        setApiVersion(response.data.version);
      })
      .catch((error) => {
        console.error("Error getting root:", error);
      });
  }, []);

  return (
    <Container>
      <h1>Welcome to the homepage!</h1>
      <p>Click on the links above to navigate.</p>
      <p>API version: {apiVersion}</p>
    </Container>
  );
}

export default Homepage;
