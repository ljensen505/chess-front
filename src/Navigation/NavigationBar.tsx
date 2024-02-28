import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Profile from "./Profile/ProfileDropdown";
import LoginButton from "./Profile/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";

function NavigationBar() {
  const { isAuthenticated } = useAuth0();

  return (
    <Navbar expand="sm" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Chess
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/games" className="nav-link">
              Games
            </Link>
            <Link to="/users" className="nav-link">
              Users
            </Link>
          </Nav>
          {isAuthenticated ? <Profile /> : <LoginButton />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
