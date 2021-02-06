import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import ImageGrid from "./components/layouts/ImageGrid";

function App() {
  const [showFormModal, setshowFormModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="App">
      {/* Header */}
      <Header
        showFormModal={showFormModal}
        setshowFormModal={setshowFormModal}
      />
      <br />
      {/* Form Model */}

      {/* Image Grid */}
      <ImageGrid />
      {/* Back to top Button */}
      <Button onClick={() => scrollToTop()}>Go Back to Top</Button>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
