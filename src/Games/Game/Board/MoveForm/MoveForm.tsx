import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BaseUser } from "../../../Games";
import { useEffect, useState } from "react";
import { PieceProps } from "../Pieces/Piece";
import { makeMove } from "../../../../api";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { DetailedGame } from "../../Game";
import "./MoveForm.css";

interface MoveFormProps {
  gameId: string;
  turn: "white" | "black";
  user: BaseUser | null;
  blackPlayerId?: string;
  whitePlayerId?: string;
  board: Record<string, PieceProps>;
  setGame: React.Dispatch<React.SetStateAction<DetailedGame | null>>;
}

function MoveForm(props: MoveFormProps) {
  const [canMakeMove, setCanMakeMove] = useState<boolean>(false);
  const [playingAs, setPlayingAs] = useState<"white" | "black" | null>(null);
  const [moveFrom, setMoveFrom] = useState("");
  const [moveFromPiece, setMoveFromPiece] = useState<PieceProps | null>(null);
  const [moveTo, setMoveTo] = useState("");
  const [moveToPiece, setMoveToPiece] = useState<PieceProps | null>(null);
  const [token, setToken] = useState<string>("");
  const [moveError, setMoveError] = useState<string>("");
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

  useEffect(() => {
    if (!props.user || !props.blackPlayerId || !props.whitePlayerId) {
      return;
    }
    setPlayingAs(
      props.user.user_id === props.blackPlayerId ? "black" : "white"
    );
  }, [props.turn, props.user, props.blackPlayerId, props.whitePlayerId]);

  useEffect(() => {
    if (playingAs === props.turn) {
      setCanMakeMove(true);
    } else {
      setCanMakeMove(false);
    }
  }, [playingAs, props.turn]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getAccessTokenSilently({ authorizationParams: { audience: audience } })
      .then((token): void => {
        setToken(token);
      })
      .catch((error) => {
        console.error("Error getting token", error);
      });
  }, [getAccessTokenSilently, isAuthenticated, audience]);

  const handleMakeMove = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moveFrom || !moveTo) {
      return;
    }
    makeMove(props.gameId, moveFrom, moveTo, token)
      .then((response) => {
        console.log("setting move from");
        setMoveFrom("");
        setMoveFromPiece(null);
        setMoveTo("");
        setMoveToPiece(null);
        props.setGame(response.data);
      })
      .catch((error) => {
        setMoveError(`Error making move: ${error.response.data["detail"]}`);
      });
  };

  const submitButton = () => {
    if (canMakeMove) {
      return (
        <Button variant="primary" type="submit">
          Make Move
        </Button>
      );
    }
    return (
      <Button variant="primary" type="submit" disabled>
        Make Move
      </Button>
    );
  };

  const handleMoveFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const square = event.target.value.toUpperCase();
    setMoveError("");
    setMoveFrom(event.target.value);
    setMoveFromPiece(props.board[square]);
    if (props.board[square] && props.board[square].color !== playingAs) {
      setMoveFromPiece(null);
    }
  };
  const handleMoveToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const square = event.target.value.toUpperCase();
    setMoveError("");
    setMoveTo(event.target.value);
    setMoveToPiece(props.board[square]);
    if (props.board[square] && props.board[square].color === playingAs) {
      setMoveToPiece(null);
    }
  };

  return (
    <Container>
      <hr />
      <Form onSubmit={handleMakeMove}>
        <Form.Group className="mb-3" controlId="formMoveFrom">
          <Form.Label>Move From</Form.Label>
          <Form.Control
            type="text"
            placeholder="A2"
            maxLength={2}
            value={moveFrom}
            onChange={handleMoveFromChange}
            required
          />
          {moveFromPiece && (
            <Form.Text className="text-muted">
              Moving: {moveFromPiece.color} {moveFromPiece.type}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMoveTo">
          <Form.Label>Move To</Form.Label>
          <Form.Control
            type="text"
            placeholder="B3"
            maxLength={2}
            value={moveTo}
            onChange={handleMoveToChange}
            required
          />
          {moveToPiece && (
            <Form.Text className="text-muted">
              Target: {moveToPiece.color} {moveToPiece.type}
            </Form.Text>
          )}
        </Form.Group>

        {submitButton()}
        {moveError && <p>{moveError}</p>}
      </Form>
      <hr />
    </Container>
  );
}

export default MoveForm;
