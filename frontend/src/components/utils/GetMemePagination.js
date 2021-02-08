import { useState, useEffect } from "react";
import axios from "axios";

const GetMemePagination = (pageNumber) => {
  const [loading, setloading] = useState(false);
  const [hasMore, sethasMore] = useState(false);
  const [memeData, setmemeData] = useState([]);

  useEffect(() => {
    setloading(true);
    axios
      .get(`${process.env.REACT_APP_XMEME_SERVER}/memes?page=${pageNumber}`)
      .then((resp) => {
        setmemeData((memes) => {
          return [...memes, ...resp.data];
        });
        sethasMore(resp.data.length > 0);
        setloading(false);
      });
  }, [pageNumber]);

  return { loading, hasMore, memeData };
};

export default GetMemePagination;
