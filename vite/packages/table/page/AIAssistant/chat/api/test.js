import request from "./request"

export const getMd = () => {
  return request({
    url: "/md"
  })
}
