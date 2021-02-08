import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import Posts from "../layouts/Posts";
import Footer from "../layouts/Footer";

function ImageGrid() {
  // Generates POST and fetches data from db with axios
  const [memeData, setmemeData] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_XMEME_SERVER}/memes`).then((resp) => {
      setmemeData(resp.data);
    });
  }, []);

  return (
    <div className="image-grid">
      <Container style={{ minHeight: "100vh" }}>
        {!memeData && <Spinner animation="border" variant="success" />}
        {memeData &&
          memeData.map((meme) => (
            <div key={meme.id}>
              <Posts
                memeName={meme.name}
                memeUrl={meme.url}
                memeCaption={meme.caption}
                memeId={meme.id}
                memeUpdatedTime={new Date(meme.created["$date"])}
                canUpdate={true}
              />
              <br />
            </div>
          ))}
      </Container>
      <Footer />
    </div>
  );
}

export default ImageGrid;
