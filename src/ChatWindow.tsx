import React from "react";
import { ChatMessage } from "./components/ChatMessage";
import { Welcome } from "./components/Welcome";
import { Avatar } from "./components/Avatar";

interface ChatWindowProps {
  chatHistory: { content: string; role: string }[];
  currentMessage: { content: string; role: string };
  state: "idle" | "waiting" | "loading";
  sendMessage: (msg: string, history: any[]) => void;
  cancel: () => void;
  clear: () => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  condition: string | null;
  bottomRef?: React.RefObject<HTMLDivElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const mapChatStateToAnimation = (state: "idle" | "waiting" | "loading"): "Idle" | "Thinking" | "Talking" => {
  switch (state) {
    case "idle":
      return "Idle";
    case "waiting":
      return "Thinking";
    case "loading":
      return "Talking";
    default:
      return "Idle"; // fallback for safety
  }
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatHistory,
  currentMessage,
  state,
  sendMessage,
  cancel,
  clear,
  message,
  setMessage,
  condition,
  bottomRef,
  inputRef,
}) => {
  const showAvatar = condition === "ANTHROPOMORPHIC";

  return (
    <div className="flex w-full h-full">
      {showAvatar && (
  <div className="w-[120px] flex-shrink-0">
    <Avatar
      condition={condition}
      animationState={mapChatStateToAnimation(state)}
    />
  </div>
)}

      {/* Chat area */}
      <div className="flex flex-col flex-grow h-full">
        <section className="overflow-y-auto flex-grow mb-4 pb-8">
          <div className="flex flex-col space-y-4">
            {chatHistory.length === 0 ? (
              <>
                <Welcome />
                {/* Sample phrases */}
              </>
            ) : (
              chatHistory.map((chat, i) => (
                <ChatMessage key={i} message={chat as any} />
              ))
            )}

            {currentMessage && <ChatMessage message={currentMessage as any} />}
          </div>

          <div ref={bottomRef} />
        </section>

        {/* Stop button */}
        <div className="flex items-center justify-center h-20">
          {state === "idle" ? null : (
            <button
              className="bg-gray-100 text-gray-900 py-2 px-4 my-8"
              onClick={cancel}
            >
              Stop generating
            </button>
          )}
        </div>

        {/* Input bar */}
        <section className="bg-gray-100 rounded-lg p-2">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message, chatHistory);
              setMessage("");
            }}
          >
            {chatHistory.length > 1 ? (
              <button
                className="bg-gray-100 text-gray-600 py-2 px-4 rounded-l-lg"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clear();
                  setMessage("");
                }}
              >
                Clear
              </button>
            ) : null}
            <input
              type="text"
              ref={inputRef}
              className="w-full rounded-l-lg p-2 outline-none"
              placeholder={state === "idle" ? "Type your message..." : "..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={state !== "idle"}
            />
            {state === "idle" ? (
              <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                type="submit"
              >
                Send
              </button>
            ) : null}
          </form>
        </section>
      </div>
    </div>
  );
};