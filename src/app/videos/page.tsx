"use client";

import { useState, useEffect, useMemo } from "react";
import LabCard from "@/components/LabCard";
import type { Video } from "@/lib/types";

interface VideoListItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  youtubeId: string;
  thumbnail: string;
  modelCount: number;
  promptCount: number;
  fileCount: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.category));
    return ["الكل", ...Array.from(cats)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let result = videos;

    if (activeFilter !== "الكل") {
      result = result.filter((v) => v.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [videos, activeFilter, searchQuery]);

  // تحويل VideoListItem لـ Video (لأن LabCard بتستخدم نوع Video)
  const toVideo = (v: VideoListItem): Video => ({
    slug: v.slug,
    title: v.title,
    description: v.description,
    category: v.category,
    date: v.date,
    youtubeId: v.youtubeId,
    thumbnail: v.thumbnail,
    models: [],
    prompts: [],
    files: [],
  });

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
        {/* Search + Filter bar */}
        <div className="videos-toolbar">
          <div className="videos-search-wrap">
            <svg className="videos-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="videos-search-input"
              placeholder="ابحث في الملاحظات... (اسم الموديل، العنوان، الفئة)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="videos-search-clear" onClick={() => setSearchQuery("")} aria-label="مسح البحث">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <span className="videos-results-count">
            {loading ? "جاري التحميل..." : `${filteredVideos.length} نتيجة`}
          </span>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`filter-pill ${activeFilter === cat ? "filter-pill-active" : "filter-pill-inactive"}`}
              style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>جاري تحميل الفيديوهات...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="lab-grid">
            {filteredVideos.map((video) => (
              <LabCard key={video.slug} video={toVideo(video)} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
            <h3 style={{ color: "var(--text)", fontSize: "1.05rem", marginBottom: "0.4rem" }}>
              لا توجد نتائج مطابقة
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.84rem" }}>
              جرب كلمة بحث مختلفة أو فلتر تاني.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("الكل"); }}
              className="btn btn-outline"
              style={{ marginTop: "1.25rem", fontSize: "0.82rem" }}
            >
              ↻ إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
