import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import logo from "../../static/images/logo192.png";
import FormModal from "./FormModal";

function Header(props) {
  return (
    <div className="header">
      <Navbar
        collapseOnSelect
        className="header_navbar"
        expand="lg"
        fixed="top"
        sticky="top"
      >
        <Container>
          <Navbar.Brand href="#">
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
              <Nav.Link>
                <Button
                  onClick={() => props.setshowFormModal(true)}
                  variant="outline-primary"
                >
                  Add Meme <FontAwesomeIcon icon={faPlus} size="xs" />
                </Button>{" "}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <FormModal
        showFormModal={props.showFormModal}
        setshowFormModal={props.setshowFormModal}
      />
    </div>
  );
}

export default Header;
