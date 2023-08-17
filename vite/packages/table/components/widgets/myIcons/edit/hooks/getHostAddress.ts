export const getHostAddress = (urlString) => {
  const regex = /^(https?:\/\/[^/?#]+).*$/;
  const match = urlString.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  }
  return urlString;
};
