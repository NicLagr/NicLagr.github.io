import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlassPortfolio from "../pages/glass/GlassPortfolio";

export default function App() {
  // The desktop cube shell has no #home anchor to skip to (it's a canvas widget,
  // not a scrollable page) — activating the skip link drops keyboard/screen-reader
  // visitors into the same accessible list layout touch/reduced-motion users get.
  const [accessibleMode, setAccessibleMode] = useState(false);
  // Every route renders the *same* element reference on purpose — swapping which
  // <Route> matches must never remount GlassPortfolio (or the WebGL cube canvas
  // inside it). Real path patterns (not one wildcard) are declared so useParams()
  // actually returns named :id/:slug values to CubeConsole/WorkSection.
  const page = <GlassPortfolio accessibleMode={accessibleMode} onAccessibleModeChange={setAccessibleMode} />;
  return (
    <BrowserRouter>
      <a
        href="#home"
        onClick={() => setAccessibleMode(true)}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] gx-btn"
      >
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={page} />
        <Route path="/work" element={page} />
        <Route path="/project/:id" element={page} />
        <Route path="/project/:id/case-study" element={page} />
        <Route path="/play" element={page} />
        <Route path="/play/:slug" element={page} />
        <Route path="/about" element={page} />
        <Route path="/contact" element={page} />
        <Route path="*" element={page} />
      </Routes>
    </BrowserRouter>
  );
}
