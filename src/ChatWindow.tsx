import React from "react";
import { ChatMessage } from "./components/ChatMessage";
import { Welcome } from "./components/Welcome";
import { Avatar } from "./components/Avatar";
import { SuggestedFollowUps } from "./components/SuggestedFollowUps";
import { SocialPresenceIndicator } from "./components/SocialPresenceIndicator";

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
  const showSurveyLink = chatHistory.length >= 10; // adjust threshold
  const encodedCondition = btoa(condition ?? "");

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
              </>
            ) : (
              chatHistory.map((chat, i) => (
                <ChatMessage key={i} message={chat as any} />
              ))
            )}

            {currentMessage && <ChatMessage message={currentMessage as any} />}

            {showSurveyLink && (
              <div className="mt-4 p-2 bg-yellow-100 rounded-lg text-center">
                {/* Optional alert once */}
                {(() => {
                  if (!window.sessionStorage.getItem("surveyAlertShown")) {
                    alert("Please continue to the next part of the survey after finishing your conversation.");
                    window.sessionStorage.setItem("surveyAlertShown", "true");
                  }
                })()}

                <a
                  {/* TODO: Replace with correct link; figure out hidden data collection field in Google Forms */}
                  href={`https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.1234567890=${encodedCondition}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline font-medium"
                  onClick={() => window.sessionStorage.setItem("surveyClicked", "true")}
                >
                  Continue to the next part of the survey
                </a>

                {/* Fallback reminder if they haven’t clicked yet */}
                {!window.sessionStorage.getItem("surveyClicked") && (
                  <p className="text-sm text-gray-600 mt-1">Click the link above to proceed to the next survey section.</p>
                )}
              </div>
            )}

            {/* Suggested follow-ups go here */}
            <SuggestedFollowUps
              condition={condition}
              sendMessage={sendMessage}
              chatHistory={chatHistory.map(msg => ({
              role: msg.role === "assistant" ? "assistant" : "user",
              content: msg.content}))}
            />
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
            className="flex items-center w-full"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message, chatHistory);
              setMessage("");
            }}
          >
          {chatHistory.length > 1 && (
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
          )}

            {/* Input + SocialPresenceIndicator wrapper */}
            <div className="flex flex-grow items-center relative">
              <input
                type="text"
                ref={inputRef}
                className="flex-grow rounded-l-lg p-2 outline-none"
                placeholder={state === "idle" ? "Type your message..." : "..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={state !== "idle"}
              />

              {/* Social presence indicator placed inside input wrapper */}
              {condition === "SOCPRESENCE" && (
                <SocialPresenceIndicator
                  condition={condition}
                  state={state}
                  className="absolute right-2" // adjust position inside wrapper
                />
              )}
            </div>

            {state === "idle" && (
              <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                type="submit"
              >
                Send
              </button>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};