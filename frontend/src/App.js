import "./App.css";
import Header from "./components/layouts/Header";
import { Container } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <Header />
      <Container maxWidth="lg"></Container>
      <h1>XMeme - Manas Acharya</h1>
    </div>
  );
}

export default App;
