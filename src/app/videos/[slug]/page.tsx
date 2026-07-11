import Link from "next/link";
import { notFound } from "next/navigation";
import PromptBlock from "@/components/PromptBlock";
import ModelCard from "@/components/ModelCard";
import FileCard from "@/components/FileCard";
import { videos, getVideoBySlug } from "@/lib/data";

export function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return { title: "غير موجود — ModelBench" };
  return {
    title: `${video.title} — ModelBench`,
    description: video.description.substring(0, 160),
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  return (
    <div className="companion-page fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Link href="/videos" className="breadcrumb-link">
            ملاحظات المختبر
          </Link>
          <span style={{ color: "var(--text-3)" }}>/</span>
          <span style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>{video.title}</span>
        </div>

        {/* Category + Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <span className="badge" style={{ color: "var(--accent)", background: "#4f80ff14", border: "1px solid #4f80ff3d" }}>
            {video.category}
          </span>
          <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
            {video.date}
          </span>
        </div>

        {/* Title */}
        <h1
          className="companion-hero"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "1rem",
            color: "var(--text)",
          }}
        >
          {video.title}
        </h1>

        {/* Description */}
        <div className="companion-hero">
          <p
            style={{
              color: "var(--text-2)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {video.description}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="companion-summary">
          <div className="companion-summary-item">
            <span>النماذج</span>
            <strong>{video.models.length}</strong>
          </div>
          <div className="companion-summary-item">
            <span>Prompts</span>
            <strong>{video.prompts.length}</strong>
          </div>
          <div className="companion-summary-item">
            <span>HTML حي</span>
            <strong>{video.files.length}</strong>
          </div>
          <div className="companion-summary-item">
            <span>الملفات</span>
            <strong>{video.files.length}</strong>
          </div>
        </div>

        {/* Shell with sidebar */}
        <div className="companion-shell" style={{ marginTop: "2.5rem" }}>
          {/* Sidebar */}
          <aside className="companion-sidebar">
            <div className="companion-sidebar-label">ملاحظة المختبر</div>
            <nav>
              <a href="#video">الفيديو</a>
              <a href="#models">النماذج</a>
              <a href="#prompts">الـ Prompts</a>
              <a href="#outputs">المخرجات الحية</a>
            </nav>
          </aside>

          {/* Main content */}
          <div>
            {/* Video */}
            <section id="video" style={{ marginBottom: "2.5rem" }}>
              <div className="section-header">
                <h2>الفيديو</h2>
                <div className="section-divider" />
              </div>
              <div
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: "12px",
                  aspectRatio: "16/9",
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>

            {/* Models */}
            <section id="models" style={{ marginBottom: "2.5rem" }}>
              <div className="section-header">
                <h2>النماذج المختبرة</h2>
                <div className="section-divider" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {video.models.map((model, i) => (
                  <ModelCard key={i} model={model} />
                ))}
              </div>
            </section>

            {/* Prompts */}
            <section id="prompts" style={{ marginBottom: "2.5rem" }}>
              <div className="section-header">
                <h2>الـ Prompts المستخدمة</h2>
                <div className="section-divider" />
              </div>
              <div>
                {video.prompts.map((prompt) => (
                  <PromptBlock key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </section>

            {/* Live HTML Outputs */}
            <section id="outputs">
              <div className="section-header">
                <h2>المخرجات الحية</h2>
                <div className="section-divider" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {video.files.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
