import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../../static/images/logo192.png";

function Header() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="light" sticky="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            XMeme
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link href="http://manasacharya.ml/" target="_blank">
                <Button variant="outline-primary">
                  Manas Acharya <FontAwesomeIcon icon={faExternalLinkAlt} />
                </Button>
              </Nav.Link>{" "}
              <Nav.Link
                href="https://xmeme-manas-api.herokuapp.com/swagger-ui/"
                target="_blank"
              >
                <Button variant="outline-success">
                  Swagger Documentation{" "}
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </Button>{" "}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
