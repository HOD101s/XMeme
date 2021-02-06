import React from "react";
import Button from "react-bootstrap/Button";

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      {/* Back to top Button */}
      <Button onClick={() => scrollToTop()}>Go Back to Top</Button>
    </div>
  );
}

export default ScrollToTopButton;
