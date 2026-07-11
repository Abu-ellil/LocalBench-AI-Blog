"use client";

import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  model: string;
  score: number;
  benchmarks: number;
  avgTtftMs: number;
  avgTokensPerSec: number;
  avgVramMb: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortKey, setSortKey] = useState<keyof LeaderboardEntry>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/leaderboard")
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
  }, []);

  // Sorting
  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "desc" ? -cmp : cmp;
  });

  const maxScore = data.length > 0 ? Math.max(...data.map((d) => d.score)) : 100;

  function toggleSort(key: keyof LeaderboardEntry) {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>لوحة المتصدرين</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            ترتيب النماذج المحلية حسب الأداء الحقيقي — سرعة، استهلاك VRAM، وجودة المخرجات.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {loading && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <div className="lb-skeleton-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="lb-skeleton-row" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginTop: "1rem", fontFamily: "var(--font-mono)" }}>
              جاري تحميل البيانات من MongoDB...
            </p>
          </div>
        )}

        {error && (
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔌</div>
            <h3 style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              قاعدة البيانات غير متاحة حالياً
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.85rem", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
              MongoDB Atlas مش متصل. تأكد من الاتصال بالإنترنت ومن إعدادات DNS. سيتم عرض البيانات فور توفر الاتصال.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
              style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}
            >
              ↻ إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              لا توجد نتائج بعد
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.85rem", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
              النماذج اللي هتختبرها وتضيفها عبر POST /api/benchmarks هتظهر هنا تلقائياً.
            </p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            {/* Stats summary */}
            <div className="lb-stats-bar">
              <div className="lb-stat-item">
                <span className="lb-stat-label">النماذج المختبرة</span>
                <strong className="lb-stat-value">{data.length}</strong>
              </div>
              <div className="lb-stat-item">
                <span className="lb-stat-label">إجمالي الاختبارات</span>
                <strong className="lb-stat-value">{data.reduce((s, d) => s + d.benchmarks, 0)}</strong>
              </div>
              <div className="lb-stat-item">
                <span className="lb-stat-label">أعلى سرعة</span>
                <strong className="lb-stat-value">
                  {Math.max(...data.map((d) => d.avgTokensPerSec)).toFixed(1)}
                  <small> tok/s</small>
                </strong>
              </div>
              <div className="lb-stat-item">
                <span className="lb-stat-label">أعلى درجة</span>
                <strong className="lb-stat-value">{Math.max(...data.map((d) => d.score)).toFixed(1)}</strong>
              </div>
            </div>

            {/* Desktop table */}
            <div className="card lb-table-wrap" style={{ marginTop: "1.5rem" }}>
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="lb-col-rank">#</th>
                    <th
                      className="lb-th-sortable"
                      onClick={() => toggleSort("model")}
                    >
                      النموذج {sortKey === "model" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="lb-th-sortable lb-col-score"
                      onClick={() => toggleSort("score")}
                    >
                      الدرجة {sortKey === "score" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="lb-th-sortable"
                      onClick={() => toggleSort("avgTokensPerSec")}
                    >
                      السرعة {sortKey === "avgTokensPerSec" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="lb-th-sortable"
                      onClick={() => toggleSort("avgTtftMs")}
                    >
                      TTFT {sortKey === "avgTtftMs" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="lb-th-sortable"
                      onClick={() => toggleSort("avgVramMb")}
                    >
                      VRAM {sortKey === "avgVramMb" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                    <th
                      className="lb-th-sortable"
                      onClick={() => toggleSort("benchmarks")}
                    >
                      الاختبارات {sortKey === "benchmarks" && (sortDir === "desc" ? "↓" : "↑")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry) => (
                    <tr key={entry.model} className="lb-row">
                      <td className="lb-col-rank">
                        <span className={`lb-rank-badge ${entry.rank <= 3 ? `lb-rank-${entry.rank}` : ""}`}>
                          {entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}
                        </span>
                      </td>
                      <td className="lb-model-name">{entry.model}</td>
                      <td className="lb-col-score">
                        <div className="lb-score-cell">
                          <div className="lb-score-bar-bg">
                            <div
                              className="lb-score-bar-fill"
                              style={{ width: `${(entry.score / maxScore) * 100}%` }}
                            />
                          </div>
                          <span className="lb-score-num">{entry.score.toFixed(1)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="lb-metric">{entry.avgTokensPerSec.toFixed(1)}</span>
                        <span className="lb-unit"> tok/s</span>
                      </td>
                      <td>
                        <span className="lb-metric">{entry.avgTtftMs}</span>
                        <span className="lb-unit"> ms</span>
                      </td>
                      <td>
                        <span className="lb-metric">{(entry.avgVramMb / 1024).toFixed(1)}</span>
                        <span className="lb-unit"> GB</span>
                      </td>
                      <td>
                        <span className="lb-badge-count">{entry.benchmarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lb-mobile-cards">
              {sorted.map((entry) => (
                <div key={entry.model} className="card lb-mobile-card">
                  <div className="lb-mobile-header">
                    <span className={`lb-rank-badge ${entry.rank <= 3 ? `lb-rank-${entry.rank}` : ""}`}>
                      {entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}
                    </span>
                    <span className="lb-mobile-model">{entry.model}</span>
                  </div>
                  <div className="lb-mobile-score-bar">
                    <div className="lb-score-bar-bg" style={{ flex: 1 }}>
                      <div
                        className="lb-score-bar-fill"
                        style={{ width: `${(entry.score / maxScore) * 100}%` }}
                      />
                    </div>
                    <span className="lb-score-num">{entry.score.toFixed(1)}</span>
                  </div>
                  <div className="lb-mobile-metrics">
                    <div>
                      <span className="lb-unit">السرعة</span>
                      <br />
                      <strong>{entry.avgTokensPerSec.toFixed(1)} tok/s</strong>
                    </div>
                    <div>
                      <span className="lb-unit">TTFT</span>
                      <br />
                      <strong>{entry.avgTtftMs} ms</strong>
                    </div>
                    <div>
                      <span className="lb-unit">VRAM</span>
                      <br />
                      <strong>{(entry.avgVramMb / 1024).toFixed(1)} GB</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
