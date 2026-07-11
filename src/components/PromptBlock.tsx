"use client";

import { useState } from "react";
import type { Prompt } from "@/lib/types";

export default function PromptBlock({ prompt }: { prompt: Prompt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="prompt-block" style={{ marginBottom: "1rem" }}>
      <div className="prompt-block-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            #{prompt.id}
          </span>
          <span style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600 }}>
            {prompt.title}
          </span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(prompt.content)}
          className="btn btn-ghost"
          style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          نسخ
        </button>
      </div>
      <div
        style={{
          maxHeight: expanded ? "none" : "6.335rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <pre style={{
          color: "var(--text)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: "1rem",
          fontSize: "0.85rem",
          lineHeight: 1.7,
          fontFamily: "var(--font-mono)",
          margin: 0,
        }}>
          {prompt.content}
        </pre>
        {!expanded && (
          <div
            style={{
              pointerEvents: "none",
              background: "linear-gradient(to bottom, transparent, var(--bg-elevated))",
              height: "3.5rem",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="prompt-toggle"
        style={{
          border: 0,
          borderTop: "1px solid var(--border)",
          width: "100%",
          height: "2.625rem",
          color: "var(--accent)",
          fontFamily: "inherit",
          cursor: "pointer",
          background: "#ffffff05",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        {expanded ? "طي" : "عرض كامل"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transition: "transform 0.18s",
            transform: expanded ? "rotate(180deg)" : "none",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
