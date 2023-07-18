import request from "./request";

export const getMd = () => {
  return request({
    url: "/md",
  });
};

export const getTopic = () => {
  return request({
    url: "/topic",
  });
};
