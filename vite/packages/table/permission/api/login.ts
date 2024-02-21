// import request from "../ui/hooks/request/index";
import request from "../request/index";
export const getUserInfo = () => {
  return request.get({
    url: "/app/getUserInfo",
    params: {
      fields:
        "uid,fans,follow,grade,post_count,signature,nickname,avatar,frame",
    },
  });
};
