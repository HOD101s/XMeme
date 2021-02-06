import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import ImageGrid from "./components/layouts/ImageGrid";
import Button from "react-bootstrap/Button";

function App() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="App">
      {/* Header */}
      <Header />
      <br />
      {/* XMeme Jumbotron */}
      {/* <Jumbotron fluid className="App__jumbotron">
        <Container className="App__jumbotron_container">
          <h1>XMeme</h1>
          <p>The Best Meme Directory</p>
        </Container>
      </Jumbotron> */}
      {/* Image Grid */}
      <ImageGrid />

      <Button onClick={() => scrollToTop()}>Go Back to Top</Button>
      <Footer />
    </div>
  );
}

export default App;
