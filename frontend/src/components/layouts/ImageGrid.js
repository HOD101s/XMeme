import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "react-avatar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import timeSince from "../utils/timeSince";

function ImageGrid() {
  const [memeData, setmemeData] = useState([]);

  useEffect(() => {
    axios.get("https://xmeme-manas-api.herokuapp.com/memes").then((resp) => {
      setmemeData(resp.data);
    });
  }, []);

  return (
    <div className="image-grid">
      <Container>
        {memeData &&
          memeData.map((meme) => (
            <div key={meme._id["$oid"]}>
              <Card className="image-grid__card">
                <Card.Title className="image-grid__card_caption">
                  {meme.caption}
                </Card.Title>
                <Card.Img variant="top" src={meme.url} />
                <Card.Body>
                  <Card.Text className="image-grid__card_name">
                    <Avatar
                      name={meme.name}
                      size="25"
                      round={true}
                      textSizeRatio={1.2}
                    />{" "}
                    {meme.name}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Uploaded {timeSince(new Date(meme.updated["$date"]))} ago
                  </small>
                </Card.Footer>
              </Card>
              <br />
            </div>
          ))}
      </Container>
    </div>
  );
}

export default ImageGrid;
