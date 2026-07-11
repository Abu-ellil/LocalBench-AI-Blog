import ResourceCard from "@/components/ResourceCard";
import { resources } from "@/lib/data";

export const metadata = {
  title: "مصادر — ModelBench",
  description: "أدوات ومصادر لاختبار وتشغيل النماذج المحلية",
};

export default function ResourcesPage() {
  const categories = Array.from(new Set(resources.map((r) => r.category)));

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
        {categories.map((category) => (
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
        ))}
      </div>
    </div>
  );
}
