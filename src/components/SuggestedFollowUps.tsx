import React, { useEffect, useState, useRef } from "react";
import { fetchFollowUpSuggestions } from "../utils/suggestedFollowUpsHelper";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SuggestedFollowUpsProps {
  condition: string | null;
  sendMessage: (msg: string, history: any[]) => void;
  chatHistory: ChatMessage[];
}

export const SuggestedFollowUps: React.FC<SuggestedFollowUpsProps> = ({
  condition,
  sendMessage,
  chatHistory,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isActive = condition === "AFFORDANCES";

  useEffect(() => {
    if (!isActive || chatHistory.length === 0) {
      setSuggestions([]);
      return;
    }
// Cancel any ongoing request
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchSuggestions = async () => {
      try {
        const generatedSuggestions = await fetchFollowUpSuggestions(
          chatHistory,
          abortController.signal
        );
        setSuggestions(generatedSuggestions);
      } catch (err) {
        console.error("Failed to fetch follow-up suggestions:", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();

    // Cleanup on unmount or if dependencies change
    return () => {
      abortController.abort();
    };
  }, [chatHistory, isActive]);

  if (!isActive || suggestions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
      {suggestions.map((phrase, index) => (
        <button
          key={index}
          onClick={() => sendMessage(phrase, chatHistory)}
          className="bg-gray-100 border-gray-300 border-2 rounded-lg p-2 text-sm hover:bg-gray-200 transition-colors"
        >
          {phrase}
        </button>
      ))}
    </div>
  );
};