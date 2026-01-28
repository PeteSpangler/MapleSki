import { useScreenDimensions } from "@/constants/screen-size";
import React from "react";

export default function MovingBackground() {
  const screenDims = useScreenDimensions();

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
