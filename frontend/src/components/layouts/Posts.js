import React, { useState } from "react";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditMemeModal from "./EditMemeModal";
import timeSince from "../utils/timeSince";

function Posts(props) {
  const [showEdit, setshowEdit] = useState(false);

  const [memeUrlProp, setmemeUrlProp] = useState(props.memeUrl);
  const [memeCaptionProp, setmemeCaptionProp] = useState(props.memeCaption);

  // Returns Individual post structure
  return (
    <div>
      <Card className="image-grid__card">
        <Card.Title className="image-grid__card__caption">
          {memeCaptionProp}
          {props.canUpdate && (
            <FontAwesomeIcon
              className="image-grid__card__edit"
              size="xs"
              icon={faEdit}
              onClick={() => setshowEdit(true)}
            />
          )}
        </Card.Title>
        <Card.Img variant="top" src={memeUrlProp} />
        <Card.Body>
          <Card.Text className="image-grid__card__name">
            <Avatar
              size="25"
              round={true}
              textSizeRatio={1.2}
              name={props.memeName}
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
      {props.canUpdate && (
        <EditMemeModal
          show={showEdit}
          setShow={setshowEdit}
          memeName={props.memeName}
          memeUrl={props.memeUrl}
          memeCaption={props.memeCaption}
          memeId={props.memeId}
          setmemeUrlParent={setmemeUrlProp}
          setmemeCaptionParent={setmemeCaptionProp}
        />
      )}
    </div>
  );
}

export default Posts;
