import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import logo from "../../static/images/logo192.png";

function Footer() {
  return (
    <div className="footer">
      <Navbar
        collapseOnSelect
        className="header_navbar"
        expand="lg"
        sticky="bottom"
      >
        <Container className="footer__container">
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
        </Container>
      </Navbar>
    </div>
  );
}

export default Footer;
