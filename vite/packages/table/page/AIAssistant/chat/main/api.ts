// gpt.js
const CHATGPT_API_URL = "https://api.closeai-proxy.xyz/v1/chat/completions";
const OPENAI_API_KEY = "sk-S7CZainBDqk8IJJR2H21882YjJMbcOQreOjeVHjIBfkoDx80";
// TODO 适用直接调chatgpt接口
export async function* getGpt3(messages) {
  const response = await fetch(CHATGPT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
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
  console.log("object :>> ", reader);
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
