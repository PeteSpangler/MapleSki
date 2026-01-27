import { useScreenDimensions } from "@/constants/screen-size";
import React from "react";
import { Platform } from "react-native";

export default function MovingBackground() {
  const screenDims = useScreenDimensions();

  // Use CSS-only background on web to avoid Skia animation issues
  if (Platform.OS === "web") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#E6F4FE",
          backgroundImage:
            "linear-gradient(45deg, #E6F4FE 25%, transparent 25%, transparent 75%, #E6F4FE 75%, #E6F4FE)",
          backgroundSize: "200% 200%",
          animation: "slideBackground 8s linear infinite",
        }}
      >
        <style>{`
          @keyframes slideBackground {
            0% { background-position: 0% 0%; }
            100% { background-position: -200% 0%; }
          }
        `}</style>
      </div>
    );
  }

  // For native, use simple static background
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#87CEEB",
      }}
    />
  );
}
