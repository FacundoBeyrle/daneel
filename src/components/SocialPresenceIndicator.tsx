import React from "react";

interface SocialPresenceIndicatorProps {
  condition: string | null;
  state: "idle" | "waiting" | "loading";
  className?: string; // optional
}

export const SocialPresenceIndicator: React.FC<SocialPresenceIndicatorProps> = ({
  condition,
  state,
  className,
}) => {
  // Only active for the social presence condition
  const isActive = condition === "SOCPRESENCE";

  if (!isActive) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Idle: subtle pulsing dots */}
      {state === "idle" && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400" />
        </div>
      )}

      {/* Waiting / Thinking: bouncing dots */}
      {(state === "waiting" || state === "loading") && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-400" />
        </div>
      )}
    </div>
  );
};