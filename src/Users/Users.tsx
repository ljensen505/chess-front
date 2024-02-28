import { Container, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllUsers } from "../api";
import { useEffect, useState } from "react";
import { BaseUser } from "../Games/Games";

function Users() {
  const [users, setUsers] = useState<BaseUser[]>([]);

  useEffect(() => {
    getAllUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Find a user</h1>
      <Form>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
        </Form.Group>
        <Form.Text className="text-muted">
          WIP: This feature is not yet implemented but will allow you to search
          for users by username.
        </Form.Text>
      </Form>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>UUID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>
                <Link to={`/${user.self}`}>{user.username}</Link>
              </td>
              <td>{user.user_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Users;
