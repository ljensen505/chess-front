import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getGame } from "../../api";
import { useEffect, useState } from "react";
import AssignGameModal from "./AssignmentModal/AssignGameModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import UserInfo from "../UserId";
import { getUserWithToken } from "../../api";
import { BaseUser } from "../Games";
import { useAuth0 } from "@auth0/auth0-react";
import Board from "./Board/Board";
import MoveForm from "./Board/MoveForm/MoveForm";
import { Link } from "react-router-dom";
import { BaseGame } from "../GamesTable";

interface Piece {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "white" | "black";
  square: string;
}

export interface DetailedGame extends BaseGame {
  turn: "white" | "black";
  turn_count: number;
  game_state?: string;
  board: Record<string, Piece>;
}

function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<DetailedGame | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [assigningColor, setAssigningColor] = useState<string>("");
  const [userDetails, setUserDetails] = useState<BaseUser | null>(null);
  const [pollingToggle, setPollingToggle] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const pollingInterval = 3000;

  useEffect(() => {
    if (!isAuthenticated || !user || !user.sub || !token) {
      return;
    }
    getUserWithToken(token)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("Error getting user details", error);
        navigate("/auth");
      });
  }, [isAuthenticated, user, token, navigate]);

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

  useEffect(() => {
    if (gameId === undefined) {
      navigate("/");
      return;
    }
    getGame(gameId)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.error("Error getting game", error);

        // If the game doesn't exist, redirect to the games list
        // 404 is returned if the game doesn't exist
        // 422 is returned if the game ID is not a valid UUID,which means it doesn't exist
        if (error.response.status === 404 || error.response.status === 422) {
          navigate("/");
        }
      });
  }, [gameId, navigate, modalShow, pollingToggle]);

  useEffect(() => {
    if (!game) {
      return;
    }
    const interval = setInterval(() => {
      getGame(game.game_id)
        .then((response) => {
          if (response.data.last_updated_at !== game.last_updated_at) {
            setPollingToggle(!pollingToggle);
          }
        })
        .catch((error) => {
          console.error("Error getting game", error);
        });
    }, pollingInterval);
    return () => clearInterval(interval);
  }, [game, pollingToggle]);

  const handleClickedAssign = (color: string) => {
    setAssigningColor(color);
    setModalShow(true);
  };

  const whitePlayer = !game?.white_player ? (
    <Button size="sm" onClick={() => handleClickedAssign("white")}>
      <FontAwesomeIcon icon={faUserPlus} />
    </Button>
  ) : (
    <Link to={game.white_player.self}>{game.white_player.username}</Link>
  );
  const blackPlayer = !game?.black_player ? (
    <Button size="sm" onClick={() => handleClickedAssign("black")}>
      <FontAwesomeIcon icon={faUserPlus} />
    </Button>
  ) : (
    <Link to={game.black_player.self}>{game.black_player.username}</Link>
  );

  const userId = userDetails?.user_id as string;
  const username = userDetails?.username as string;

  if (!game) {
    return <div>Loading...</div>;
  }

  const gameStats = (
    <Container>
      <p>Owner: {game.owner.username}</p>
      <p>Black Player: {blackPlayer}</p>
      <p>White Player: {whitePlayer}</p>
      <p>Game State: {game?.game_state}</p>
      <p>Turn: {game?.turn}</p>
      <p>Turn Count: {game?.turn_count}</p>
    </Container>
  );

  return (
    <Container>
      <h1>Game {gameId}</h1>
      <UserInfo userUUID={userId} username={username} />
      <MoveForm
        gameId={game.game_id}
        setGame={setGame}
        user={userDetails}
        turn={game.turn}
        blackPlayerId={game.black_player?.user_id}
        whitePlayerId={game.white_player?.user_id}
        board={game.board}
      />
      <Board board={game.board} gameID={game.game_id} />
      <AssignGameModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        game_id={gameId}
        assigningcolor={assigningColor}
      />
      {gameStats}
    </Container>
  );
}

export default Game;
