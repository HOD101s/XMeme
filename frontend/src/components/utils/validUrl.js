const validUrl = (str) => {
  // source https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  // checks if string is url with URL constructor
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

export default validUrl;
