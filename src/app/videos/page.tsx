"use client";

import { useState, useMemo } from "react";
import LabCard from "@/components/LabCard";
import { videos } from "@/lib/data";

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.category));
    return ["الكل", ...Array.from(cats)];
  }, []);

  // Filter + search
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
          v.category.toLowerCase().includes(q) ||
          v.models.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

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
          {/* Search */}
          <div className="videos-search-wrap">
            <svg
              className="videos-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
              <button
                className="videos-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="مسح البحث"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Results count */}
          <span className="videos-results-count">
            {filteredVideos.length} نتيجة
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
        {filteredVideos.length > 0 ? (
          <div className="lab-grid">
            {filteredVideos.map((video) => (
              <LabCard key={video.slug} video={video} />
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
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("الكل");
              }}
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
