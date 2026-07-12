"use client";

import { useState } from "react";
import type { OutputFile } from "@/lib/types";

export default function FileCard({ file }: { file: OutputFile }) {
  const [mode, setMode] = useState<"preview" | "source">("preview");

  function handleOpen() {
    // افتح الـ HTML في tab جديدة
    const blob = new Blob([file.previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // نظّف بعد ثانية
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function handleDownload() {
    // حمّل كملف .html
    const blob = new Blob([file.previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.promptTitle.replace(/\s+/g, "-").toLowerCase() || "output"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
        <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0, alignItems: "center" }}>
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
          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 0.25rem" }} />
          {/* Open */}
          <button
            onClick={handleOpen}
            className="btn file-action"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem", gap: "0.3rem" }}
            title="فتح في tab جديدة"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            فتح
          </button>
          {/* Download */}
          <button
            onClick={handleDownload}
            className="btn file-action"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem", gap: "0.3rem" }}
            title="تحميل كملف HTML"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            تحميل
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
