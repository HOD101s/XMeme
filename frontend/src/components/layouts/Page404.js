import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";

function Page404() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>
        XMeme Could not <FontAwesomeIcon icon={faBinoculars} /> Resource
      </h1>
    </div>
  );
}

export default Page404;
