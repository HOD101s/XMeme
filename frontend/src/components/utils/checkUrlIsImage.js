import axios from "axios";

async function checkUrlIsImage(url) {
  // Gets url response data
  try {
    let response = await axios.get(url);
    let validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/apng",
      "image/avif",
      "image/jfif",
      "image/webp",
    ];
    console.log(response.headers["content-type"]);
    return validTypes.includes(response.headers["content-type"]);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default checkUrlIsImage;
