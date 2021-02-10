import React, { useState } from "react";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import EditMemeModal from "./EditMemeModal";
import CommentMemeModal from "./CommentMemeModal";
import Comments from "./Comments";
import timeSince from "../utils/timeSince";

function Posts(props) {
  const [showEdit, setshowEdit] = useState(false);
  const [showComments, setshowComments] = useState(false);
  const [showCommentModal, setshowCommentModal] = useState(false);
  const [memeUrlProp, setmemeUrlProp] = useState(props.memeUrl);
  const [memeCaptionProp, setmemeCaptionProp] = useState(props.memeCaption);
  const [commentProp, setcommentProp] = useState(props.memeComments);

  // Returns Individual post structure
  return (
    <div>
      <Card className="image-grid__card">
        <Card.Title className="image-grid__card__caption">
          {memeCaptionProp}
        </Card.Title>
        <Card.Img
          variant="top"
          src={memeUrlProp}
          alt={memeCaptionProp}
          onError={(e) => {
            e.target.onerror = null;
            e.src = "../../static/images/logo192.png";
          }}
        />
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
          {commentProp.length > 0 && (
            <FontAwesomeIcon
              className="image-grid__card__showCommentArrow"
              icon={faArrowRight}
              onClick={() =>
                setshowComments((prevShowSomments) => !prevShowSomments)
              }
            />
          )}
          <FontAwesomeIcon
            className="image-grid__card__addCommentButton"
            icon={faPlus}
            onClick={() => {
              setshowCommentModal((prev) => !prev);
            }}
          />
          {props.canUpdate && (
            <FontAwesomeIcon
              className="image-grid__card__editPostButton"
              icon={faEdit}
              onClick={() => setshowEdit(true)}
            />
          )}
          {showComments && <Comments comments={commentProp} />}
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

      {showCommentModal && (
        <CommentMemeModal
          show={showCommentModal}
          setShow={setshowCommentModal}
          setComments={setcommentProp}
          memeId={props.memeId}
        />
      )}
    </div>
  );
}

export default Posts;
