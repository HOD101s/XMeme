import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Flip from "react-reveal/Flip";

// source https://codepen.io/Qbrid/pen/GjVvwL
// Original Updates toggle visibility
class ScrollToTopButton extends React.Component {
  constructor() {
    super();

    this.state = {
      is_visible: false,
    };
  }

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener("scroll", function (e) {
      scrollComponent.toggleVisibility();
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  toggleVisibility() {
    if (
      window.pageYOffset > 300 &&
      window.innerHeight + window.scrollY <= document.body.offsetHeight - 20
    ) {
      this.setState({
        is_visible: true,
      });
    } else {
      this.setState({
        is_visible: false,
      });
    }
  }

  render() {
    const { is_visible } = this.state;
    return (
      <>
        {is_visible && (
          <Flip bottom>
            <button
              title="Back to top"
              className="scroll"
              onClick={() => {
                this.scrollToTop();
              }}
            >
              <span className="arrow-up">
                <FontAwesomeIcon icon={faAngleUp} />
              </span>
            </button>
          </Flip>
        )}
      </>
    );
  }
}

export default ScrollToTopButton;
