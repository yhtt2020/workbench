import service from "./request";
const translateRes = "/app/translate";

// 首页推荐
export const getTranslate = (data) => {
  return service.post(translateRes, { ...data });
};
