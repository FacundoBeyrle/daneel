import React, { useContext, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX, useAnimations } from "@react-three/drei";
import { ConditionContext } from "../utils/CondContext";
import * as THREE from "three";

interface AvatarProps {
  condition?: string | null;
  animationState?: "Idle" | "Talking" | "Thinking";
}

function CharacterWithAnimations({
  animationState = "Idle",
}: {
  animationState?: "Idle" | "Talking" | "Thinking";
}) {
  // Load base character (with skin)
  const character = useFBX("/models/character.fbx");

  // Load animations (without skin)
  const idle = useFBX("/models/idle.fbx");
  const talking = useFBX("/models/talking.fbx");
  const thinking = useFBX("/models/thinking.fbx");

  // Extract animation clips
  const clips = [
    idle.animations[0],
    talking.animations[0],
    thinking.animations[0],
  ];

  // Map animation names to clips for easier access
  const { actions } = useAnimations(clips, character);

  useEffect(() => {
    if (!actions) return;

    // Stop all animations first
    Object.values(actions).forEach((action) => action?.stop());

    // Play the requested animation
    const action = actions[animationState];
    if (action) {
      action.reset().fadeIn(0.3).play();
    }
  }, [animationState, actions]);

  return <primitive object={character as THREE.Object3D} scale={0.01} position={[0, -1.5, 0]} />;
}

export const Avatar: React.FC<AvatarProps> = ({
  condition,
  animationState = "Idle",
}) => {
  const contextCondition = useContext(ConditionContext);
  const activeCondition = condition ?? contextCondition;

  if (activeCondition !== "ANTHROPOMORPHIC") return null;

  return (
    <div
      style={{
        width: "250px",
        height: "100%",
        marginRight: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 3], fov: 30 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <CharacterWithAnimations animationState={animationState} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
};