import React, { useState } from "react";
import GlassPortfolio from "../pages/glass/GlassPortfolio";

export default function App() {
  // The desktop cube shell has no #home anchor to skip to (it's a canvas widget,
  // not a scrollable page) — activating the skip link drops keyboard/screen-reader
  // visitors into the same accessible list layout touch/reduced-motion users get.
  const [accessibleMode, setAccessibleMode] = useState(false);
  return (
    <>
      <a
        href="#home"
        onClick={() => setAccessibleMode(true)}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] gx-btn"
      >
        Skip to content
      </a>
      <GlassPortfolio accessibleMode={accessibleMode} onAccessibleModeChange={setAccessibleMode} />
    </>
  );
}
