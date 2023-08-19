import request from "..";
import { aiStore } from "../../../../store/ai";

// 获取gpt
export async function* gpt(messages) {
  const ai: any = aiStore();
  console.log("ai.key :>> ", ai.key);
  const response = await fetch(ai.url + "/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ai.key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response!.body!.getReader();
  let decoder = new TextDecoder();
  let resultData = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    resultData += decoder.decode(value);
    while (resultData.includes("\n")) {
      const messageIndex = resultData.indexOf("\n");
      const message = resultData.slice(0, messageIndex);
      resultData = resultData.slice(messageIndex + 1);
      if (message.startsWith("data: ")) {
        const jsonMessage = JSON.parse(message.substring(5));
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
  return request.get<any>({
    url: "/dashboard/billing/credit_grants",
  });
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
