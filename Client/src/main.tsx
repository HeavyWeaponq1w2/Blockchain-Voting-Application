import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Voting from "./routes/voting/Voting";
import CastVote from "./routes/castVote/castVote";
import AdminPanel from "./routes/adminPanel/adminPanel";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Voting />} />
        <Route path="/castVote" element={<CastVote />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
