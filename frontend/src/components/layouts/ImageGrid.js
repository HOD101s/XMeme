import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Posts from "./Posts";
import Footer from "./Footer";

function ImageGrid() {
  // Generates POST and fetches data from db with axios
  const [memeData, setmemeData] = useState([]);

  useEffect(() => {
    axios.get("https://xmeme-manas-api.herokuapp.com/memes").then((resp) => {
      setmemeData(resp.data);
    });
  }, []);

  return (
    <div className="image-grid">
      <Container>
        {memeData &&
          memeData.map((meme) => (
            <div key={meme._id["$oid"]}>
              <Posts
                memeName={meme.name}
                memeUrl={meme.url}
                memeCaption={meme.caption}
                memeId={meme._id["$oid"]}
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
