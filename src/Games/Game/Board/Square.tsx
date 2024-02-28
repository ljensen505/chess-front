import Piece, { PieceProps } from "./Pieces/Piece";

interface SquareProps {
  color: string;
  piece?: PieceProps;
  position: string;
}

function Square(props: SquareProps) {
  return (
    <div className={`square ${props.color}`}>
      {props.piece && <Piece {...props.piece} />}
    </div>
  );
}

export default Square;
