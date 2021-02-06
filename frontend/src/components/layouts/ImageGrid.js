import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "react-avatar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function ImageGrid() {
  const [memeData, setmemeData] = useState([]);

  useEffect(() => {
    axios.get("https://xmeme-manas-api.herokuapp.com/memes").then((resp) => {
      setmemeData(resp.data);
    });
    return () => {};
  }, []);

  const timeSince = (date) => {
    {
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }
  };

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
            // <div className="image-grid__card">
            //   <div className="image-grid__card_name">
            //     <Avatar name={meme.name} size="35" round={true} />{" "}
            //     <h4>{meme.name}</h4>
            //   </div>
            //   <img src={meme.url} />
            //   <h4 className="image-grid__card__caption">{meme.caption}</h4>
            // </div>
          ))}
      </Container>
    </div>
  );
}

export default ImageGrid;
