import React from "react";
import GlassPortfolio from "../pages/glass/GlassPortfolio";

export default function App() {
  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] gx-btn"
      >
        Skip to content
      </a>
      <GlassPortfolio />
    </>
  );
}
