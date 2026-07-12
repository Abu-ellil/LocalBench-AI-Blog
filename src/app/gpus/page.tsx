"use client";

import { useState, useEffect } from "react";

interface Gpu {
  name: string; vram: string; tier: string; notes: string;
}

export default function GpusPage() {
  const [gpus, setGpus] = useState<Gpu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gpus")
      .then((r) => r.json())
      .then((d) => { setGpus(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>دليل كروت الشاشة</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            دليل شامل لكروت الشاشة الاستهلاكية لتشغيل النماذج المحلية — AMD و NVIDIA.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "2rem", borderLeft: "3px solid var(--accent)" }}>
          <p style={{ color: "var(--text-2)", fontSize: "0.84rem", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>نصيحة:</strong> لكروت AMD استخدم{" "}
            <code>llama.cpp</code> مع <code>--vulkan</code> أو <code>--rocm</code>، أو{" "}
            <code>KoboldCpp</code>. لكروت NVIDIA استخدم <code>CUDA</code> مباشرة.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>جاري التحميل...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {gpus.map((gpu) => (
              <div key={gpu.name} className="card" style={{ padding: "1.25rem", ...(gpu.name === "RX 6600 XT" ? { borderColor: "var(--accent)", boxShadow: "0 0 0 1px #4f80ff38" } : {}) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h3 style={{ color: "var(--text)", fontSize: "1.05rem", fontWeight: 700 }}>
                    {gpu.name}
                    {gpu.name === "RX 6600 XT" && (
                      <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", marginRight: "0.5rem", verticalAlign: "middle" }}>· جهازي</span>
                    )}
                  </h3>
                  <span className="badge" style={{
                    color: gpu.tier === "الأفضل" ? "var(--success)" : gpu.tier === "جيد جداً" ? "var(--accent)" : "var(--warning)",
                    background: gpu.tier === "الأفضل" ? "#34d39914" : gpu.tier === "جيد جداً" ? "#4f80ff14" : "#fbbf2414",
                    border: `1px solid ${gpu.tier === "الأفضل" ? "#34d3993d" : gpu.tier === "جيد جداً" ? "#4f80ff3d" : "#fbbf243d"}`,
                  }}>{gpu.tier}</span>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)", border: "1px solid var(--border)", background: "#ffffff06", borderRadius: "4px", padding: "0.16rem 0.5rem", fontWeight: 700 }}>{gpu.vram} VRAM</span>
                </div>
                <p style={{ color: "var(--text-2)", fontSize: "0.82rem", lineHeight: 1.5 }}>{gpu.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
