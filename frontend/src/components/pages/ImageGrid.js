import React, { useState, useRef, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Posts from "../layouts/Posts";
import Footer from "../layouts/Footer";
import GetMemePagination from "../utils/GetMemePagination";

function ImageGrid() {
  // Generates POST and fetches data from db with axios
  const [pageNumber, setpageNumber] = useState(1);

  const { loading, memeData, hasMore } = GetMemePagination(pageNumber);

  const observer = useRef();
  const lastMemeRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setpageNumber((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="image-grid">
      <Container style={{ minHeight: "100vh" }}>
        {memeData.length > 0 &&
          memeData.map((meme, index) => {
            if (memeData.length === index + 1) {
              return (
                <div key={meme.id} ref={lastMemeRef}>
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
              );
            } else {
              return (
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
              );
            }
          })}
        {loading && <Spinner animation="border" variant="success" />}
      </Container>
      <Footer />
    </div>
  );
}

export default ImageGrid;
