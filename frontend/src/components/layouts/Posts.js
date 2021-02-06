import React from "react";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import timeSince from "../utils/timeSince";

function Posts(props) {
  return (
    <div>
      <Card className="image-grid__card">
        <Card.Title className="image-grid__card_caption">
          {props.memeCaption}
        </Card.Title>
        <Card.Img variant="top" src={props.memeUrl} />
        <Card.Body>
          <Card.Text className="image-grid__card_name">
            <Avatar
              name={props.memeName}
              size="25"
              round={true}
              textSizeRatio={1.2}
            />{" "}
            {props.memeName}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            Uploaded {timeSince(props.memeUpdatedTime)} ago
          </small>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Posts;
