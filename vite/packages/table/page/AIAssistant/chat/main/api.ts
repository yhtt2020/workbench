import { aiStore } from "../../../../store/ai";
export async function* getStreamData(messages) {
  console.log("开始请求GPT :>> ");
  // 创建一个请求对象
  const ai: any = aiStore();
  const request = new Request(ai.url + "/v1/chat/completions", {
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

  try {
    // 请求
    const response = await fetch(request);

    const stream = response.body;
    const decoder = new TextDecoder("utf-8");
    const reader = stream!.getReader();

    // 请求错误处理
    if (!response.ok) {
      const { done, value } = await reader!.read();
      yield {
        value: JSON.parse(decoder.decode(value)),
      };
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 请求成功处理
    let resultData = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("彻底结束");
        reader.releaseLock();
        break;
      }
      //   const chunk = decoder.decode(value, { stream: true });
      let chunk = decoder.decode(value);

      resultData += decoder.decode(value);
      while (resultData.includes("\n")) {
        const messageIndex = resultData.indexOf("\n");
        const message = resultData.slice(0, messageIndex);
        resultData = resultData.slice(messageIndex + 1);

        if (message.startsWith("data: [DONE]")) {
          console.log("结束前 :>> ");
          break;
        }
        if (message.startsWith("data: ")) {
          let res = JSON.parse(message.slice(5));
          const createdID = res.created;
          yield {
            content: res.choices[0]?.delta?.content || "",
            role: "assistant",
            id: createdID,
          };
        }
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
