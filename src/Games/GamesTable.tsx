import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteGame } from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import whiteQueenPNG from "../assets/pieces/white/queen.png";
import blackQueenPNG from "../assets/pieces/black/queen.png";

export interface BasicUserInfo {
  username: string;
  user_id: string;
  self: string;
}

export interface BaseGame {
  game_id: string;
  self: string;
  owner: BasicUserInfo;
  black_player?: BasicUserInfo;
  white_player?: BasicUserInfo;
  created_at: string;
  last_updated_at?: string;
}

interface GamesListProps {
  games: BaseGame[];
  ownerID: string;
  gamesDidUpdate: boolean;
  setGamesDidUpdate: (value: boolean) => void;
  // ownerID: string;
  // setOwnerID: (value: string) => void;
}

function GamesTable(props: GamesListProps) {
  const [token, setToken] = useState<string>("");
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    getAccessTokenSilently({ authorizationParams: { audience: audience } })
      .then((token) => {
        setToken(token);
      })
      .catch((error) => {
        console.error("Error getting token", error);
      });
  }, [getAccessTokenSilently, isAuthenticated, audience, navigate]);

  const handleDeleteGame = (gameId: string) => {
    deleteGame(gameId, token)
      .then(() => {
        props.setGamesDidUpdate(!props.gamesDidUpdate);
      })
      .catch((error) => {
        console.error(`Error deleting game with id: ${gameId}`, error);
      });
  };

  const isGameOwner = (game: BaseGame) => {
    return game.owner.user_id === props.ownerID;
  };

  const TrashButton = (game: BaseGame) => {
    return (
      <Button
        variant="danger"
        disabled={!isGameOwner(game)}
        onClick={() => {
          handleDeleteGame(game.game_id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    );
  };

  // sort game array by creation date
  props.games.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const playerIcon = (game: BaseGame) => {
    if (game.black_player?.user_id === props.ownerID) {
      return <img src={blackQueenPNG} alt="Black Queen" />;
    } else if (game.white_player?.user_id === props.ownerID) {
      return <img src={whiteQueenPNG} alt="White Queen" />;
    }

    return null;
  };

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Game ID</th>
            <th>Created</th>
            <th>Last Move</th>
            <th>Opponent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.games.map((game) => (
            <tr key={game.game_id}>
              <td>{playerIcon(game)}</td>
              <td>
                <Link to={game.self}>{game.game_id}</Link>
              </td>
              <td>{new Date(game.created_at).toLocaleString()}</td>
              <td>
                {game.last_updated_at
                  ? new Date(game.last_updated_at).toLocaleString()
                  : null}
              </td>
              <td>
                {game.black_player?.user_id === props.ownerID
                  ? game.white_player?.username
                  : game.black_player?.username}
              </td>
              <td>{TrashButton(game)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default GamesTable;
