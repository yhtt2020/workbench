import axios from "axios";
import request from "..";
import { aiStore } from "../../../../store/ai";

// 获取gpt
export async function* gpt(messages) {
  const ai: any = aiStore();
  const response = await fetch(ai.url + "/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ai.key}`,
    },

    body: JSON.stringify({
      model: ai.gpt,
      stream: true,
      messages,
      temperature: parseFloat(ai.temperature),
    }),
  });

  const reader = response!.body!.getReader();
  let decoder = new TextDecoder();

  if (!response.ok) {
    const { done, value } = await reader.read();
    console.log("done :>> ", done);
    console.log("value :>> ", decoder.decode(value));
    yield {
      value: JSON.parse(decoder.decode(value)),
    };
    return;
    // throw new Error(`HTTP error! status: ${response.status}`);
  }

  let resultData = "";

  while (true) {
    console.log("1111 :>> ", 1111);
    const { done, value } = await reader.read();
    if (done) break;
    resultData += decoder.decode(value);
    while (resultData.includes("\n")) {
      const messageIndex = resultData.indexOf("\n");
      const message = resultData.slice(0, messageIndex);
      resultData = resultData.slice(messageIndex + 1);
      if (message.startsWith("data: ")) {
        const jsonMessage = JSON.parse(message.substring(5));
        console.log("jsonMessage :>> ", jsonMessage);
        if (resultData.includes("[DONE]")) {
          break;
        }
        const createdID = jsonMessage.created;
        yield {
          content: jsonMessage.choices[0]?.delta?.content || "",
          role: "assistant",
          id: createdID,
        };
      }
    }
  }
}

// 获取余额
export const balance = () => {
  // return request.get<any>({
  //   url: "/dashboard/billing/credit_grants",
  // });
  console.log("111 :>> ", 111);
  const ai: any = aiStore();
  const service = axios.create({
    // baseURL: "https://wad.apps.vip/api", //请求的地址
    baseURL: "https://api.openai-proxy.live", //请求的地址
    timeout: 5000, //访问超时的时间
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${ai.key}`,
    },
  });

  return service.get("/dashboard/billing/credit_grants");
};

export function test(data?: any) {
  return request.get<any>({
    url: "/api/v1/links",
  });
}

export function gpt3(data?: any) {
  return request.post<any>({
    url: "/api/v1/healthy",

    data: {
      model: "gpt-3.5-turbo",
      messages: data,
      temperature: 1,
    },
  });
}
