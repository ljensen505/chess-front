import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Square from "./Square";
import { PieceProps } from "./Pieces/Piece";
import "./Board.css";

interface BoardProps {
  board: Record<string, PieceProps>;
  gameID: string;
}

function Board(props: BoardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const emptyBoard = () => {
    const board = [];

    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const key = `${i}${j}`;
        const color = (i + j) % 2 === 0 ? "white" : "black";
        const position = `${String.fromCharCode(97 + j).toUpperCase()}${8 - i}`;
        const piece = props.board[position];
        row.push(
          <Square key={key} color={color} position={position} piece={piece} />
        );
      }
      board.push(isFlipped ? row.reverse() : row);
    }

    return isFlipped ? board.reverse() : board;
  };

  const toggleOrientation = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Container className="mb-3">
      <h1 className="text-center">
        Board{" "}
        <Button variant="secondary" onClick={toggleOrientation}>
          <FontAwesomeIcon icon={faRotate} />
        </Button>
      </h1>
      <div className="board">{emptyBoard()}</div>
    </Container>
  );
}

export default Board;
