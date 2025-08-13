import React, { useContext, useEffect, useState } from "react";
import { ConditionContext } from "../utils/CondContext";
import Lottie from "lottie-react";



interface AvatarProps {
  condition?: string | null;
}

export const Avatar: React.FC<AvatarProps> = ({ condition }) => {
  const contextCondition = useContext(ConditionContext);
  const activeCondition = condition ?? contextCondition;

  const [isAnimating, setIsAnimating] = useState(false);
  const [avatarType, setAvatarType] = useState<"human" | "robot" | null>(null);
    
    // Determine which avatar to display based on the condition
  useEffect(() => {
    if (activeCondition === "ANTHROPOMORPHIC") {
      setAvatarType("human");
    } else {
      setAvatarType(null); // no avatar for control/other conditions
    }
  }, [activeCondition]);

  // Example animation: simple idle loop
  useEffect(() => {
    if (avatarType) {
      const interval = setInterval(() => {
        setIsAnimating((prev) => !prev); // toggles animation state
      }, 1000); // switch every second
      return () => clearInterval(interval);
    }
  }, [avatarType]);

  if (!avatarType) return null;

  return (
    <div
      className={`avatar-container ${avatarType}`}
      style={{
        width: "120px",
        height: "300px", // taller to match chat height
        backgroundColor: avatarType === "human" ? "#FFDAB9" : "#B0C4DE",
        borderRadius: "10px",
        marginRight: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        transform: isAnimating ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      {avatarType === "human" ? "🧑" : "🤖"}
    </div>
  );
};