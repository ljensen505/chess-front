import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { DropdownButton } from "react-bootstrap";
import { useState } from "react";

const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();
  const [token, setToken] = useState<string>("");
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  if (token === "" && isAuthenticated) {
    getAccessTokenSilently({
      authorizationParams: { audience: audience },
    })
      .then((token) => {
        setToken(token);
      })
      .catch((error) => {
        console.error("Error getting token:", error);
        console.error("Trying to get token with popup");
        getAccessTokenWithPopup({ authorizationParams: { audience: audience } })
          .then((token) => {
            if (token === undefined) {
              console.error("Token is undefined");
              return;
            }
            setToken(token);
          })
          .catch((error) => {
            console.error("Error getting token with popup:", error);
          });
      });
  }

  return (
    isAuthenticated && (
      <DropdownButton variant="info" title="Profile" id="basic-nav-dropdown">
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <p>{user?.sub}</p>
        <LogoutButton />
      </DropdownButton>
    )
  );
};

export default Profile;
