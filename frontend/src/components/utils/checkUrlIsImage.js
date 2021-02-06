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
    return validTypes.includes(response.headers["content-type"]);
  } catch {
    return false;
  }
}

export default checkUrlIsImage;
