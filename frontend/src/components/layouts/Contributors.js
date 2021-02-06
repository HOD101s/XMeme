import React, { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import axios from "axios";

function Contributors() {
  const [ownerNameData, setownerNameData] = useState([]);

  useEffect(() => {
    axios
      .get("https://xmeme-manas-api.herokuapp.com/contributors")
      .then((resp) => {
        setownerNameData(resp.data);
      });
  }, []);

  const badge = ["primary", "secondary", "success", "danger", "warning"];
  return (
    <div>
      <Container className="contributorsBadgeContainer">
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
    </div>
  );
}

export default Contributors;
