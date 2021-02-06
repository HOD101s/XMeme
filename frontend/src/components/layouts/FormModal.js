import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import validUrl from "../utils/validUrl";
import axios from "axios";
import Avatar from "react-avatar";
import timeSince from "../utils/timeSince";

function FormModal(props) {
  const [memeName, setmemeName] = useState("");
  const [memeUrl, setmemeUrl] = useState("");
  const [memeCaption, setmemeCaption] = useState("");

  const submitMeme = async () => {
    let error_elem = document.getElementById("error_msg");
    error_elem.innerText = "";
    // Check if any field is empty
    if (!memeCaption || !memeName || !memeCaption) {
      error_elem.innerText = "Kindly enter values for all fields";
      return;
    }

    // check if URL is valid
    if (!validUrl(memeUrl)) {
      error_elem.innerText = "Kindly enter valid URL";
      return;
    }

    try {
      await axios.post("https://xmeme-manas-api.herokuapp.com/memes", {
        name: memeName,
        url: memeUrl,
        caption: memeCaption,
      });
      window.location.reload();
    } catch (e) {
      if (e.response.data.msg) {
        error_elem.innerText = e.response.data.msg;
      } else {
        error_elem.innerText = e;
      }
    }
  };

  return (
    <div>
      <Modal
        show={props.showFormModal}
        onHide={() => props.setshowFormModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Meme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="nameForm">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="name"
                value={memeName}
                onChange={(e) => setmemeName(e.target.value)}
              />
              <Form.Text className="text-muted">
                XMeme appreciates Original Posts
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="urlForm">
              <Form.Label>Meme URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="url"
                value={memeUrl}
                onChange={(e) => setmemeUrl(e.target.value)}
              />
              <Form.Text className="text-muted">
                Kindly add a valid image URL
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="captionForm">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                placeholder="caption"
                value={memeCaption}
                onChange={(e) => setmemeCaption(e.target.value)}
              />
              <Form.Text className="text-muted">
                This is where you bring in the humour
              </Form.Text>
            </Form.Group>
          </Form>

          <Form.Label>Post Preview</Form.Label>
          <Container className="text-center">
            {/* Post Preview: Cannot use Posts component due to props loop */}
            <Card className="image-grid__card">
              <Card.Title className="image-grid__card_caption">
                {memeCaption}
              </Card.Title>
              <Card.Img variant="top" src={memeUrl} />
              <Card.Body>
                <Card.Text className="image-grid__card_name">
                  <Avatar
                    name={memeName}
                    size="25"
                    round={true}
                    textSizeRatio={1.2}
                  />{" "}
                  {memeName}
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
          <Button
            variant="success"
            onClick={async () => {
              await submitMeme();
            }}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FormModal;
