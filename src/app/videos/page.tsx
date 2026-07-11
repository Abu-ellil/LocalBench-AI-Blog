import LabCard from "@/components/LabCard";
import { videos } from "@/lib/data";

export const metadata = {
  title: "ملاحظات المختبر — ModelBench",
  description: "جميع تجارب واختبارات النماذج المحلية",
};

export default function VideosPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>ملاحظات المختبر</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            جميع تجارب واختبارات النماذج المحلية — prompts، مخرجات، ومقارنات.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <span className="filter-pill filter-pill-active">الكل</span>
          <span className="filter-pill filter-pill-inactive">اختبار LLM</span>
          <span className="filter-pill filter-pill-inactive">برمجة</span>
          <span className="filter-pill filter-pill-inactive">أدوات</span>
        </div>

        <div className="lab-grid">
          {videos.map((video) => (
            <LabCard key={video.slug} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
