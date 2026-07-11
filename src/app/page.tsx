import Link from "next/link";
import LabCard from "@/components/LabCard";
import ResourceCard from "@/components/ResourceCard";
import { getLatestVideos, resources } from "@/lib/data";

export default function HomePage() {
  const latestVideos = getLatestVideos(3);

  return (
    <div className="fade-in">
      {/* =================== HERO =================== */}
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="hero-orb-blue" />
        <div className="hero-orb-purple" />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
            {/* Hero text */}
            <div className="hero-text" style={{ flex: 1, minWidth: 300 }}>
              <div className="hero-kicker">
                <span />
                نماذج محلية / كروت شاشة حقيقية
              </div>
              <h1 className="hero-wordmark" aria-label="LocalBench">
                <span className="hero-wordmark-part hero-wordmark-1">Local</span>
                <span className="hero-wordmark-part hero-wordmark-2">Bench</span>
              </h1>
              <p className="hero-copy">
                ملاحظات من تشغيل النماذج المحلية على كروت شاشة استهلاك: prompts، كود
                مولّد، مخرجات خام، وملفات HTML حية من الفيديوهات.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                <Link href="/videos" className="btn btn-primary" style={{ fontSize: "0.9rem", padding: "0.75rem 1.625rem" }}>
                  افتح ملاحظات المختبر
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <a
                  href="https://www.youtube.com/channel/UClnq0KE_pVQ27O3iT1ZriUg"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline"
                  style={{ fontSize: "0.9rem", padding: "0.75rem 1.625rem" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  شاهد على يوتيوب
                </a>
              </div>
              <div className="hero-stat-row" style={{ justifyContent: "flex-start", marginTop: "2rem" }}>
                <div className="hero-stat-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  <strong>{latestVideos.length}</strong> ملاحظة مختبر
                </div>
                <div className="hero-stat-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                  <strong>1.2K+</strong> مشترك
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div style={{ flexShrink: 0, maxWidth: 430, width: "100%" }}>
              <div
                className="card"
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
                }}
              >
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-card))",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 30% 30%, #4f80ff33, transparent 50%), radial-gradient(circle at 70% 70%, #9b6dff33, transparent 50%)",
                    }}
                  />
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1" style={{ opacity: 0.5 }}>
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== LATEST LAB NOTES =================== */}
      <section className="container" style={{ marginBottom: "4rem" }}>
        <div className="section-header">
          <h2>أحدث ملاحظات المختبر</h2>
          <div className="section-divider" />
          <Link href="/videos" className="btn btn-ghost" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            عرض الكل ←
          </Link>
        </div>
        <div className="lab-grid">
          {latestVideos.map((video) => (
            <LabCard key={video.slug} video={video} />
          ))}
        </div>
      </section>

      {/* =================== RESOURCES =================== */}
      <section className="container" style={{ marginBottom: "4rem" }}>
        <div className="section-header">
          <h2>مصادر</h2>
          <div className="section-divider" />
          <Link href="/resources" className="btn btn-ghost" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            عرض الكل ←
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {resources.slice(0, 5).map((resource) => (
            <ResourceCard key={resource.url} resource={resource} />
          ))}
        </div>
      </section>
    </div>
  );
}
