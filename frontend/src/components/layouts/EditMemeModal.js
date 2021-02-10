import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Avatar from "react-avatar";
import axios from "axios";
import validUrl from "../utils/validUrl";
import timeSince from "../utils/timeSince";

function EditMemeModal(props) {
  // Edit meme form modal

  // Meme Url and Caption states
  const [memeUrl, setmemeUrl] = useState(props.memeUrl);
  const [memeCaption, setmemeCaption] = useState(props.memeCaption);

  // validates edit data and sends updates to api
  const editMeme = async () => {
    let error_elem = document.getElementById("error_msg");
    error_elem.innerText = "";
    let updateObj = {};

    if (memeUrl !== props.memeUrl && memeUrl) {
      // check if URL is valid
      if (!validUrl(memeUrl)) {
        error_elem.innerText = "Kindly enter valid URL";
        return;
      }

      updateObj["url"] = memeUrl;
    }
    if (memeCaption !== props.memeCaption && memeCaption) {
      updateObj["caption"] = memeCaption;
    }

    if (Object.keys(updateObj).length === 0) {
      error_elem.innerText = "Must set some different value";
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_XMEME_SERVER}/memes/${props.memeId}`,
        updateObj
      );
      //   Change DOM values instead of reload
      if (updateObj.hasOwnProperty("caption")) {
        props.setmemeCaptionParent(updateObj["caption"]);
      }
      if (updateObj.hasOwnProperty("url")) {
        props.setmemeUrlParent(updateObj["url"]);
      }
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
          setmemeUrl(props.memeUrl);
          setmemeCaption(props.memeCaption);
          props.setShow(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Meme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Edited url */}
            <Form.Group controlId="urlForm">
              <Form.Label>Meme URL</Form.Label>
              <Form.Control
                type="text"
                placeholder={memeUrl}
                onChange={(e) => setmemeUrl(e.target.value)}
              />
              <Form.Text className="text-muted">
                Kindly add a valid image URL
              </Form.Text>
            </Form.Group>
            {/* Edited Caption */}
            <Form.Group controlId="captionForm">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                placeholder={memeCaption}
                onChange={(e) => setmemeCaption(e.target.value)}
              />
              <Form.Text className="text-muted">
                This is where you bring in the humour
              </Form.Text>
            </Form.Group>
          </Form>

          <Form.Label>Post Preview</Form.Label>
          {/* Post Preview: Cannot use Posts component due to props loop */}
          <Container className="text-center">
            <Card className="image-grid__card">
              <Card.Title className="image-grid__card_caption">
                {memeCaption}
              </Card.Title>
              <Card.Img variant="top" src={memeUrl} />
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
                  Uploaded {timeSince(new Date())} ago
                </small>
              </Card.Footer>
            </Card>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Badge variant="danger" id="error_msg"></Badge>
          <Button variant="success" onClick={async () => await editMeme()}>
            Confirm Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditMemeModal;
