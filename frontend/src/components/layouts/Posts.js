import React, { useState } from "react";
import Avatar from "react-avatar";
import Card from "react-bootstrap/Card";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faArrowRight,
  faPlus,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import EditMemeModal from "./EditMemeModal";
import CommentMemeModal from "./CommentMemeModal";
import Comments from "./Comments";
import timeSince from "../utils/timeSince";

function Posts(props) {
  // Component Model for Posts
  const [copyMsg, setcopyMsg] = useState("Copy Meme Link");
  const [showEdit, setshowEdit] = useState(false);
  const [showComments, setshowComments] = useState(false);
  const [showCommentModal, setshowCommentModal] = useState(false);
  const [memeUrlProp, setmemeUrlProp] = useState(props.memeUrl);
  const [memeCaptionProp, setmemeCaptionProp] = useState(props.memeCaption);
  const [commentProp, setcommentProp] = useState(props.memeComments);

  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://freefrontend.com/assets/img/html-css-404-page-templates/HTML-404-Page-with-SVG.png";
  };

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
          onError={addDefaultSrc}
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
            <OverlayTrigger
              placement="left"
              delay={{ show: 250, hide: 250 }}
              overlay={<Tooltip id="viewCommentTooltip">View Comments</Tooltip>}
            >
              <FontAwesomeIcon
                className="image-grid__card__showCommentArrow"
                icon={faArrowRight}
                onClick={() =>
                  setshowComments((prevShowSomments) => !prevShowSomments)
                }
              />
            </OverlayTrigger>
          )}
          <OverlayTrigger
            placement={commentProp.length > 0 ? "bottom" : "left"}
            delay={{ show: 250, hide: 250 }}
            overlay={<Tooltip id="addCommentTooltip">Add Comment</Tooltip>}
          >
            <FontAwesomeIcon
              className="image-grid__card__GenericPostButton"
              icon={faPlus}
              onClick={() => {
                setshowCommentModal((prev) => !prev);
              }}
            />
          </OverlayTrigger>
          {props.canUpdate && (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 250 }}
              overlay={<Tooltip id="editPostTooltip">Edit Post</Tooltip>}
            >
              <FontAwesomeIcon
                className="image-grid__card__GenericPostButton"
                icon={faEdit}
                onClick={() => setshowEdit(true)}
              />
            </OverlayTrigger>
          )}

          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 250 }}
            overlay={<Tooltip id="editPostTooltip">{copyMsg}</Tooltip>}
          >
            <CopyToClipboard text={memeUrlProp}>
              <FontAwesomeIcon
                className="image-grid__card__GenericPostButton"
                icon={faClipboard}
                onClick={() => {
                  setcopyMsg("Copied!");
                  setTimeout(() => {
                    setcopyMsg("Copy Meme Link");
                  }, 5000);
                }}
              />
            </CopyToClipboard>
          </OverlayTrigger>
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

      <CommentMemeModal
        show={showCommentModal}
        setShow={setshowCommentModal}
        setComments={setcommentProp}
        memeId={props.memeId}
      />
    </div>
  );
}

export default Posts;
