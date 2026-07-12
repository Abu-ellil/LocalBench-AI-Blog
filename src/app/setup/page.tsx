"use client";

import { useState, useEffect } from "react";

interface Spec { label: string; value: string; sub: string; icon: string; }
interface SetupData {
  specs: Spec[];
  software: string[];
  note: string;
}

export default function SetupPage() {
  const [data, setData] = useState<SetupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="container" style={{ paddingTop: "3rem" }}>
        <p style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>إعداداتي</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            تفاصيل الجهاز والإعداد المستخدم في جميع اختبارات LocalBench AI.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Hardware Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {data.specs.map((spec) => (
            <div key={spec.label} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div className="resource-icon" style={{ width: 32, height: 32 }}>
                  {spec.icon === "cpu" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
                      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                  )}
                  {spec.icon === "ram" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 9h20v8H2z" /><path d="M5 17v2M9 17v2M15 17v2M19 17v2" />
                      <line x1="6" y1="13" x2="10" y2="13" /><line x1="14" y1="13" x2="18" y2="13" />
                    </svg>
                  )}
                  {spec.icon === "gpu" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="8" cy="12" r="2.5" /><circle cx="16" cy="12" r="2.5" />
                    </svg>
                  )}
                </div>
                <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{spec.label}</h3>
              </div>
              <p style={{ color: "var(--text)", fontSize: "1.05rem", fontWeight: 700 }}>{spec.value}</p>
              <p style={{ color: "var(--text-2)", fontSize: "0.82rem", marginTop: "0.3rem" }}>{spec.sub}</p>
            </div>
          ))}
        </div>

        {/* AMD Note */}
        <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "2rem", borderLeft: "3px solid var(--warning)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p style={{ color: "var(--warning)", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.4rem" }}>ملاحظة بخصوص AMD GPU</p>
              <p style={{ color: "var(--text-2)", fontSize: "0.84rem", lineHeight: 1.6 }}>{data.note}</p>
            </div>
          </div>
        </div>

        {/* Software Stack */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>البرمجيات</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {data.software.map((s) => (
              <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-2)", border: "1px solid var(--border)", background: "#ffffff06", borderRadius: "4px", padding: "0.16rem 0.5rem", fontWeight: 700 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
