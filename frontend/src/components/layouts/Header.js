import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../../static/images/logo192.png";

function Header() {
  return (
    <div className="header">
      <Navbar collapseOnSelect expand="lg" sticky="top">
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
            <Badge
              onClick={() => {
                window.open("http://manasacharya.ml/");
                window.focus();
              }}
              pill
              variant="dark"
            >
              by Manas Acharya
            </Badge>
            <Nav className="mr-auto"></Nav>
            <Nav>
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
