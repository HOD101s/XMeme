import React from "react";
import { Chip, Toolbar, Typography, Container } from "@material-ui/core";
import logo from "../../static/images/logo192.png";
import "../../static/css/header.css";

const openProfileSite = () => {
  window.open("https://www.manasacharya.ml", "_blank");
  window.focus();
};

function Header() {
  return (
    <div className="header">
      <Container maxWidth="lg">
        <Toolbar className="header__toolbar">
          <img src={logo} alt="logo" className="header__logo" />
          <Typography className="header__title" variant="h6">
            XMeme
          </Typography>{" "}
          <Typography className="header__titleby" variant="body">
            by
          </Typography>
          <Chip
            className="header__ownerchip"
            color="secondary"
            label="Manas Acharya"
            onClick={openProfileSite}
          />
        </Toolbar>
      </Container>
    </div>
  );
}

export default Header;
