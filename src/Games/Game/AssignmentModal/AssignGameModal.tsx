import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { assignGame } from "../../../api";
import { useAuth0 } from "@auth0/auth0-react";

interface AssignGameModalProps {
  show: boolean;
  onHide: () => void;
  assigningcolor: string;
  game_id?: string;
}

function AssignGameModal(props: AssignGameModalProps) {
  const [playerId, setPlayerId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE as string,
      },
    })
      .then((token) => {
        setToken(token);
      })
      .catch((error) => {
        console.error("Error getting token", error);
      });
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!props.game_id) {
      console.error("Game ID not found");
      return;
    }
    assignGame(props.game_id, playerId, props.assigningcolor, token)
      .then(() => {
        props.onHide();
      })
      .catch((error) => {
        setError(
          `Error assigning player to game: ${error}: ${error.response.data.detail}`
        );
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Assign Player to {props.assigningcolor.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Enter the ID of the player you want to assign to play as{" "}
          {props.assigningcolor}
        </p>

        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formPlayerId">
            <Form.Label>Player ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="c65149db-c316-42c7-9ccf-0c6a163c1683"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          {error && <p>{error}</p>}
          <Button type="submit" variant="primary">
            Assign
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

export default AssignGameModal;
