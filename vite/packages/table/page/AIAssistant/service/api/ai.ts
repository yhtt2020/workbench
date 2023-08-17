import request from "../ai";
export function test(data?: any) {
  return request.get<any>({
    url: "/links",
    data,
  });
}
export function gpt3(data?: any) {
  return request.post<any>({
    url: "/chat/completions",
    // data: {
    //   model: "gpt-3.5-turbo",
    //   // messages: [{ role: "user", content: "Hello!" }]
    //   messages: data, // 传递数组
    // },
    data: {
      model: "gpt-3.5-turbo",
      messages: data,
      temperature: 1,
    },
  });
}
