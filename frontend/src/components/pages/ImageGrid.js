import React, { useState, useRef, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Posts from "../layouts/Posts";
import Footer from "../layouts/Footer";
import GetMemePagination from "../utils/GetMemePagination";

function ImageGrid() {
  // Populates Mainpage with posts
  const [pageNumber, setpageNumber] = useState(1);

  const { loading, memeData, hasMore } = GetMemePagination(pageNumber);

  // Ref for observing last loaded meme
  const observer = useRef();

  // Updates pagination page number to trigger next infinite scroll api call
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
              // Set ref for last loaded meme
              return (
                <div key={meme.id} ref={lastMemeRef}>
                  <Posts
                    memeName={meme.name}
                    memeUrl={meme.url}
                    memeCaption={meme.caption}
                    memeId={meme.id}
                    memeComments={meme.comments}
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
                    memeComments={meme.comments}
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
