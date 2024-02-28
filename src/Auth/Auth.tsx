import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserWithToken } from "../api";
import RegistrationModal from "./RegistrationModal";
import { Container } from "react-bootstrap";

export interface NewUserProps {
  email: string;
  name: string;
  auth0_id: string;
  username: string;
}

function Auth() {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string>("");
  const [registrationModalShow, setRegistrationModalShow] = useState(false);
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

  useEffect(() => {
    if (!user) {
      return;
    }
    getAccessTokenSilently({
      authorizationParams: {
        audience: audience,
      },
    })
      .then((token) => {
        setToken(token);
        getUserWithToken(token)
          .then(() => {
            navigate("/games");
          })
          .catch((error) => {
            console.error("Error getting user details", error);
            if (error.response.status === 404) {
              setRegistrationModalShow(true);
            }
          });
      })
      .catch((error) => {
        console.error("Error getting token", error);
      });
  }, [user, getAccessTokenSilently, audience, navigate]);

  return (
    <Container>
      <RegistrationModal
        show={registrationModalShow}
        onHide={() => setRegistrationModalShow(false)}
        name={user?.name}
        email={user?.email}
        token={token}
        auth0_id={user?.sub}
      />
      <h1>Welcome to Chess!</h1>
    </Container>
  );
}

export default Auth;
