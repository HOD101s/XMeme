import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import Footer from "../layouts/Footer";

function Contributors() {
  const [ownerNameData, setownerNameData] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_XMEME_SERVER}/contributors`)
      .then((resp) => {
        setownerNameData(resp.data);
      });
  }, []);

  const badge = ["primary", "secondary", "success", "danger", "warning"];
  return (
    <div>
      <h1>Meet Our XMeme Community</h1>
      <h6>👩‍💻❤😎👨‍💻</h6>
      <br />
      {!ownerNameData && <Spinner animation="border" variant="success" />}
      <Container
        className="contributorsBadgeContainer"
        style={{ minHeight: "75vh" }}
      >
        {ownerNameData &&
          ownerNameData.map((name, id) => (
            <>
              <h4 className="contributorsBadgeHeaderWrap">
                <Badge variant={badge[id % badge.length]}>
                  {name._id} <Badge variant="light">{name.count}</Badge>
                </Badge>{" "}
              </h4>
            </>
          ))}
      </Container>
      <Footer />
    </div>
  );
}

export default Contributors;
