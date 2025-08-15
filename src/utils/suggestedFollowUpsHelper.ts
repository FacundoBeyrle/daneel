import { appConfig } from "../../config.browser";

const API_PATH = "/api/chat";
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function fetchFollowUpSuggestions(
  chatHistory: ChatMessage[],
  abortSignal?: AbortSignal
): Promise<string[]> {
  const body = JSON.stringify({
    messages: [
      ...chatHistory,
      {
        role: "system",
        content:
          "Generate 3 short and relevant follow-up questions or statements for the user to choose from. Return them as a JSON array of strings without extra text.",
      },
    ].slice(-appConfig.historyLength),
  });

  const res = await fetch(API_PATH, {
    method: "POST",
    body,
    signal: abortSignal,
  });

  if (!res.ok || !res.body) {
    console.error("Failed to fetch follow-up suggestions");
    return [];
  }

  const decoder = new TextDecoder();
  let fullResponse = "";

  for await (const chunk of streamAsyncIterator(res.body)) {
    fullResponse += decoder.decode(chunk);
  }

  try {
  const parsed = JSON.parse(fullResponse);
  if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
    return parsed;
  }
  console.warn("Unexpected follow-up format:", parsed);
  return [];
} catch (err) {
  console.error("Error parsing follow-up suggestions:", err);
  return [];
}
}

// You’ll need the same streamAsyncIterator function from your use-chat.ts:
async function* streamAsyncIterator(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}