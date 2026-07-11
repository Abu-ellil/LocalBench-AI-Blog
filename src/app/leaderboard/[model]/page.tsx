"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ModelBenchmark {
  id: string;
  score: number;
  tokensPerSec: number;
  ttftMs: number;
  vramMb: number;
  createdAt: string;
}

interface ModelStats {
  avg: number;
  max: number;
  min: number;
}

interface ModelDetail {
  model: string;
  benchmarkCount: number;
  stats: {
    score: ModelStats;
    tokensPerSec: ModelStats;
    ttftMs: ModelStats;
    vramMb: ModelStats;
  };
  benchmarks: ModelBenchmark[];
}

function StatCard({
  label,
  icon,
  avg,
  max,
  min,
  unit,
}: {
  label: string;
  icon: string;
  avg: number;
  max: number;
  min: number;
  unit: string;
}) {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.85rem" }}>
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
        <span style={{ color: "var(--text-3)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.6rem" }}>
        <strong style={{ color: "#0000", background: "linear-gradient(115deg, var(--text), #8fb0ff 62%, #b69aff)", WebkitBackgroundClip: "text", backgroundClip: "text", fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
          {avg}
        </strong>
        <span style={{ color: "var(--text-3)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>{unit}</span>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.72rem", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
        <span>↑ {max}</span>
        <span>↓ {min}</span>
      </div>
    </div>
  );
}

export default function ModelDetailPage() {
  const params = useParams();
  const modelSlug = decodeURIComponent(params.model as string);
  const [data, setData] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/benchmarks/${encodeURIComponent(modelSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [modelSlug]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div className="lb-skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="lb-skeleton-row" style={{ height: "80px", animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginTop: "1rem", fontFamily: "var(--font-mono)" }}>
            جاري تحميل بيانات النموذج...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔌</div>
          <h3 style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            غير قادر على تحميل البيانات
          </h3>
          <p style={{ color: "var(--text-2)", fontSize: "0.85rem", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
            النموذج غير موجود أو قاعدة البيانات غير متاحة.
          </p>
          <Link href="/leaderboard" className="btn btn-outline" style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
            ← العودة للوحة المتصدرين
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Link href="/leaderboard" className="breadcrumb-link">
              ← لوحة المتصدرين
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "var(--text)" }}>
              {data.model}
            </h1>
            <span className="badge" style={{ color: "var(--accent)", background: "#4f80ff14", border: "1px solid #4f80ff3d" }}>
              {data.benchmarkCount} اختبار
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          <StatCard label="الدرجة" icon="📊" avg={data.stats.score.avg} max={data.stats.score.max} min={data.stats.score.min} unit="/100" />
          <StatCard label="السرعة" icon="⚡" avg={data.stats.tokensPerSec.avg} max={data.stats.tokensPerSec.max} min={data.stats.tokensPerSec.min} unit="tok/s" />
          <StatCard label="TTFT" icon="⏱️" avg={data.stats.ttftMs.avg} max={data.stats.ttftMs.max} min={data.stats.ttftMs.min} unit="ms" />
          <StatCard label="VRAM Peak" icon="💾" avg={Math.round(data.stats.vramMb.avg / 1024 * 10) / 10} max={Math.round(data.stats.vramMb.max / 1024 * 10) / 10} min={Math.round(data.stats.vramMb.min / 1024 * 10) / 10} unit="GB" />
        </div>

        {/* History table */}
        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <h2>سجل الاختبارات</h2>
          <div className="section-divider" />
        </div>

        <div className="card lb-table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th>الدرجة</th>
                <th>السرعة</th>
                <th>TTFT</th>
                <th>VRAM</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {data.benchmarks.map((b, i) => (
                <tr key={b.id} className="lb-row">
                  <td>
                    <div className="lb-score-cell">
                      <div className="lb-score-bar-bg">
                        <div
                          className="lb-score-bar-fill"
                          style={{ width: `${b.score}%` }}
                        />
                      </div>
                      <span className="lb-score-num">{b.score}</span>
                    </div>
                  </td>
                  <td>
                    <span className="lb-metric">{b.tokensPerSec}</span>
                    <span className="lb-unit"> tok/s</span>
                  </td>
                  <td>
                    <span className="lb-metric">{b.ttftMs}</span>
                    <span className="lb-unit"> ms</span>
                  </td>
                  <td>
                    <span className="lb-metric">{(b.vramMb / 1024).toFixed(1)}</span>
                    <span className="lb-unit"> GB</span>
                  </td>
                  <td>
                    <span className="lb-unit" style={{ fontFamily: "var(--font-mono)" }}>
                      {new Date(b.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
