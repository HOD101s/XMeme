import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
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
