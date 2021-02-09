import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

function CommentMemeModal(props) {
  const [commentText, setcommentText] = useState("");
  const [commentName, setcommentName] = useState("");

  const uploadComment = async () => {
    let error_elem = document.getElementById("error_msg");
    error_elem.innerText = "";
    if (!commentText || !commentName) {
      error_elem.innerText = "Enter Both Values";
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_XMEME_SERVER}/addcomment`, {
        _id: props.memeId,
        name: commentName,
        comment: commentText,
      });
      //   Change DOM values instead of reload
      let commentObj = { name: commentName, comment: commentText };
      props.setComments((prev) => [...prev, commentObj]);
      props.setShow(false);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.msg) {
        error_elem.innerText = e.response.data.msg;
      } else {
        error_elem.innerText = e;
      }
    }
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="urlForm">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="UserName"
                onChange={(e) => setcommentName(e.target.value)}
              />
              <Form.Text className="text-muted">Username for comment</Form.Text>
            </Form.Group>

            <Form.Group controlId="captionForm">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                type="text"
                placeholder="Comment"
                onChange={(e) => setcommentText(e.target.value)}
              />
              <Form.Text className="text-muted">Let's keep it SFW</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Badge variant="danger" id="error_msg"></Badge>
          <Button variant="success" onClick={async () => await uploadComment()}>
            Submit Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CommentMemeModal;
