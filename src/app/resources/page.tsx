"use client";

import { useState, useEffect, useMemo } from "react";
import ResourceCard from "@/components/ResourceCard";
import type { Resource } from "@/lib/types";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(resources.map((r) => r.category))),
    [resources]
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>مصادر</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            أدوات ومصادر لاختبار وتشغيل النماذج المحلية.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>جاري تحميل المصادر...</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "var(--text-3)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {category}
                </span>
                <span
                  style={{
                    color: "var(--text-3)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "0.1rem 0.5rem",
                    fontSize: "0.72rem",
                  }}
                >
                  {resources.filter((r) => r.category === category).length}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {resources
                  .filter((r) => r.category === category)
                  .map((resource) => (
                    <ResourceCard key={resource.url} resource={resource} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
