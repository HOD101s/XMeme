import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Posts from "./Posts";

function FormModal(props) {
  const [memeName, setmemeName] = useState("");
  const [memeUrl, setmemeUrl] = useState("");
  const [memeCaption, setmemeCaption] = useState("");

  const submitMeme = () => {
    console.log(memeName, memeUrl, memeCaption);
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
          <Container>
            <Posts
              memeName={memeName}
              memeUrl={memeUrl}
              memeCaption={memeCaption}
              memeUpdatedTime={new Date()}
            />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Badge variant="danger" id="error_msg"></Badge>
          <Button variant="success" onClick={submitMeme}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FormModal;
