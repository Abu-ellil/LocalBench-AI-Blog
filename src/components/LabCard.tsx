import type { Video } from "@/lib/types";
import Link from "next/link";

export default function LabCard({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.slug}`} className="surface-rise" style={{ textDecoration: "none", color: "inherit" }}>
      <article className="card lab-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="lab-card-thumb">
          <img src={video.thumbnail} alt={video.title} />
        </div>
        <div className="lab-card-body" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span className="lab-card-badge">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" />
              </svg>
              {video.category}
            </span>
            <span className="lab-card-date">{video.date}</span>
          </div>
          <h3 className="lab-card-title">{video.title}</h3>
          <p className="lab-card-desc">{video.description}</p>
          <div className="lab-card-meta">
            <span>{video.models.length} نموذج</span>
            <span>{video.files.length} ملف</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
