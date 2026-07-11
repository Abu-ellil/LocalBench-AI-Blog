"use client";

import { useState } from "react";
import type { OutputFile } from "@/lib/types";

export default function FileCard({ file }: { file: OutputFile }) {
  const [mode, setMode] = useState<"preview" | "source">("preview");

  return (
    <div className="file-card">
      <div className="file-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
          <span style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {file.promptTitle}
          </span>
          <span style={{ color: "var(--text-3)", fontSize: "0.72rem", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
            — {file.modelName}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
          <button
            className={`btn file-action ${mode === "preview" ? "file-action-active" : ""}`}
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
            onClick={() => setMode("preview")}
          >
            معاينة
          </button>
          <button
            className={`btn file-action ${mode === "source" ? "file-action-active" : ""}`}
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
            onClick={() => setMode("source")}
          >
            المصدر
          </button>
        </div>
      </div>
      <div className="file-card-body">
        {mode === "preview" ? (
          <iframe
            srcDoc={file.previewHtml}
            className="file-preview-iframe"
            title={`${file.promptTitle} - ${file.modelName}`}
            sandbox="allow-scripts"
          />
        ) : (
          <div className="file-source" style={{ maxHeight: "480px", overflow: "auto" }}>
            <pre
              style={{
                color: "var(--text)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                padding: "1.25rem",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                fontFamily: "var(--font-mono)",
              }}
            >
              {file.sourceCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
