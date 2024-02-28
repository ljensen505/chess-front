import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container } from "react-bootstrap";
import UserInfo from "./UserId";
import { postGame, getGames, getUserWithToken } from "../api";
import GamesTable, { BaseGame } from "./GamesTable";
import { useNavigate } from "react-router-dom";

export interface BaseUser {
  self: string;
  user_id: string;
  username: string;
  games: BaseGame[];
}

export interface DetailedUser extends BaseUser {
  email: string;
  name: string;
  auth0_id: string;
}

function Games() {
  const [games, setGames] = useState<BaseGame[]>([]);
  const [token, setToken] = useState<string>("");
  const [gamesDidUpdate, setGamesDidUpdate] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<DetailedUser | null>(null);
  const [pollingToggle, setPollingToggle] = useState<boolean>(false);
  const { getAccessTokenSilently, isAuthenticated, user, loginWithRedirect } =
    useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;
  const pollingInterval = 3000;
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    loginWithRedirect();
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getAccessTokenSilently({ authorizationParams: { audience: audience } })
      .then((token): void => {
        setToken(token);
        getGames(token)
          .then((response) => {
            setGames(response.data);
          })
          .catch((error) => {
            console.error("Error getting games", error);
          });
      })
      .catch((error) => {
        console.error("Error getting token", error);
      });
  }, [
    getAccessTokenSilently,
    isAuthenticated,
    audience,
    gamesDidUpdate,
    pollingToggle,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !user || !user.sub || !token) {
      return;
    }
    getUserWithToken(token)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("ERROR getting user details", error);
        navigate("/auth");
      });
  }, [isAuthenticated, user, token, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPollingToggle(!pollingToggle);
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingToggle]);

  const handleNewGame = () => {
    postGame(token)
      .then(() => {
        setGamesDidUpdate(!gamesDidUpdate);
      })
      .catch((error) => {
        console.error("Error creating game", error);
      });
  };

  return (
    <Container>
      <h1>{user?.name}'s Games</h1>
      <UserInfo
        userUUID={userDetails?.user_id as string}
        username={userDetails?.username as string}
      />
      <Container>
        <Button variant="success" onClick={handleNewGame}>
          New Game
        </Button>
      </Container>
      <GamesTable
        games={games}
        gamesDidUpdate={gamesDidUpdate}
        setGamesDidUpdate={setGamesDidUpdate}
        ownerID={userDetails?.user_id as string}
      />
    </Container>
  );
}

export default Games;
