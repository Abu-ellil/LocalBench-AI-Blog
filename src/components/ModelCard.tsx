import type { Model } from "@/lib/types";

export default function ModelCard({ model }: { model: Model }) {
  return (
    <div className="model-card">
      <div className="model-name">{model.name}</div>
      <div className="model-meta">
        {model.quantization && (
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            {model.quantization}
          </span>
        )}
        {model.hardware && (
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
            {model.hardware}
          </span>
        )}
        {model.provider && (
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
            {model.provider}
          </span>
        )}
        {model.type === "local" ? "محلي" : "سحابي"}
      </div>
    </div>
  );
}
