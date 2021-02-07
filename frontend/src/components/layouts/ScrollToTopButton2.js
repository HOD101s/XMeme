import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

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
      <FontAwesomeIcon icon={faAngleUp} onClick={() => scrollToTop()} />
    </div>
  );
}

export default ScrollToTopButton;
