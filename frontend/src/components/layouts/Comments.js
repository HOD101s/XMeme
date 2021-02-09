import React from "react";
import Avatar from "react-avatar";

function Comments(props) {
  return (
    <div className="comments">
      {props.comments &&
        props.comments.map((comment, index) => (
          <span key={index}>
            <p>
              <Avatar
                size="15"
                round={true}
                textSizeRatio={1.2}
                name={comment.name}
              />{" "}
              <strong>{comment.name}</strong>: {comment.comment}
            </p>
          </span>
        ))}
    </div>
  );
}

export default Comments;
