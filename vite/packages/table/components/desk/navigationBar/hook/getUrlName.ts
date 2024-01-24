export const useGetUrlName = (url) => {
  const match = url.match(/^https?:\/\/([^/]+)/);
  return match ? match[1] : null;
};
