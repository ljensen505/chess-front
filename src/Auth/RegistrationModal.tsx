import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postUser } from "../api";
import { NewUserProps } from "./Auth";

interface RegistrationModalProps {
  show: boolean;
  onHide: () => void;
  name?: string;
  email?: string;
  token?: string;
  auth0_id?: string;
}

function RegistrationModal(props: RegistrationModalProps) {
  const [username, setUsername] = useState<string>("");
  const [newUser, setNewUser] = useState<NewUserProps | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!props.token) {
      console.error("No token found");
      return;
    }
    if (!newUser) {
      console.error("No user found");
      return;
    }

    postUser(props.token, newUser)
      .then(() => {
        props.onHide();
        navigate("/games");
      })
      .catch((error) => {
        console.error("Error creating user", error.response.data.detail);
        if (error.response.status === 400) {
          setError(error.response.data.detail);
        }
      });
  };

  useEffect(() => {
    if (!props.token || !username || !props.auth0_id || !props.name) {
      return;
    }
    const newUser: NewUserProps = {
      username: username,
      email: props.email,
      name: props.name,
      auth0_id: props.auth0_id,
    };
    setNewUser(newUser);
  }, [props, username]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError("");
  };

  return (
    <Modal
      {...props}
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          New User Registration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formPlayerId">
            <Form.Label>Welcome, {props.name} </Form.Label>
            <Form.Control
              type="text"
              placeholder="username"
              value={username}
              onChange={handleTextChange}
              required
              autoFocus
              maxLength={20}
            />
            {error && <p className="text-danger">{error}</p>}
            <Form.Text>
              Your username is a unique and publicly available identifier for
              others to find you. This way you can play games with your friends,
              and we don't have to reveal your email address: {props?.email}
            </Form.Text>
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegistrationModal;
