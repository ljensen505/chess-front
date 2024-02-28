import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Container, Row, Toast } from "react-bootstrap";

interface UserDetailsProps {
  userUUID: string;
  username: string;
}

function UserInfo(props: UserDetailsProps) {
  const [showToast, setShowToast] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Container style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: "10px" }}>
            Your user ID: <code>{props.userUUID}</code>
          </p>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => copyToClipboard(props.userUUID as string)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </Container>
        <Container style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: "10px" }}>
            Your username: <code>{props.username}</code>
          </p>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => copyToClipboard(props.username)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
        </Container>
      </Row>
      <Toast
        bg="info"
        className="position-absolute bottom-0 end-0 m-3"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ color: "black", fontWeight: "bold" }}
      >
        <Toast.Body>Copied!</Toast.Body>
      </Toast>
      <hr />
    </Container>
  );
}
export default UserInfo;
