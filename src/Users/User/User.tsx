import { Container, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BaseUser } from "../../Games/Games";
import { useEffect, useState } from "react";
import { getUserByUuid } from "../../api";

function User() {
  const [user, setUser] = useState<BaseUser | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      return;
    }
    getUserByUuid(userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error getting user", error);
        navigate("/games");
      });
  }, [userId, navigate]);

  return (
    <Container>
      <h1>{user?.username}'s Profile</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Owner ID</th>
            <th>Black Player ID</th>
            <th>White Player ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {user?.games.map((game) => (
            <tr key={game.game_id}>
              <td>
                <Link to={game.self}>{game.game_id}</Link>
              </td>
              <td>
                <Link to={game.owner.self}>{game.owner.username}</Link>
              </td>
              <td>
                {game.black_player ? (
                  <Link to={game.black_player.self}>
                    {game.black_player.username}
                  </Link>
                ) : (
                  "None"
                )}
              </td>
              <td>
                {game.white_player ? (
                  <Link to={game.white_player.self}>
                    {game.white_player.username}
                  </Link>
                ) : (
                  "None"
                )}
              </td>
              <td>{new Date(game.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default User;
