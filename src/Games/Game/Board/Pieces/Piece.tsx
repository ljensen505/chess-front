import "./Piece.css";
import blackKingUrl from "../../../../assets/pieces/black/king.png";
import whiteKingUrl from "../../../../assets/pieces/white/king.png";
import blackQueenUrl from "../../../../assets/pieces/black/queen.png";
import whiteQueenUrl from "../../../../assets/pieces/white/queen.png";
import blackRookUrl from "../../../../assets/pieces/black/rook.png";
import whiteRookUrl from "../../../../assets/pieces/white/rook.png";
import blackBishopUrl from "../../../../assets/pieces/black/bishop.png";
import whiteBishopUrl from "../../../../assets/pieces/white/bishop.png";
import blackKnightUrl from "../../../../assets/pieces/black/knight.png";
import whiteKnightUrl from "../../../../assets/pieces/white/knight.png";
import blackPawnUrl from "../../../../assets/pieces/black/pawn.png";
import whitePawnUrl from "../../../../assets/pieces/white/pawn.png";

export interface PieceProps {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "white" | "black";
}

function Piece(props: PieceProps) {
  const getPieceUrl = () => {
    switch (props.type) {
      case "king":
        return props.color === "white" ? whiteKingUrl : blackKingUrl;
      case "queen":
        return props.color === "white" ? whiteQueenUrl : blackQueenUrl;
      case "rook":
        return props.color === "white" ? whiteRookUrl : blackRookUrl;
      case "bishop":
        return props.color === "white" ? whiteBishopUrl : blackBishopUrl;
      case "knight":
        return props.color === "white" ? whiteKnightUrl : blackKnightUrl;
      case "pawn":
        return props.color === "white" ? whitePawnUrl : blackPawnUrl;
    }
  };
  return (
    <div className="piece-container">
      <img src={getPieceUrl()} alt={`${props.color} ${props.type}`} />
    </div>
  );
}

export default Piece;
