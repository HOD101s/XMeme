import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/layouts/Header";
import ImageGrid from "./components/layouts/ImageGrid";

function App() {
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
    </div>
  );
}

export default App;
