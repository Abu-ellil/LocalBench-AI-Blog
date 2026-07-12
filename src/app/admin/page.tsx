"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ============================================================
// Admin Dashboard — LocalBench AI
// ============================================================

const ADMIN_PASSWORD = "localbench-admin-2025";

interface VideoItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  youtubeId: string;
  modelCount: number;
  promptCount: number;
  fileCount: number;
}

interface ResourceItem {
  title: string;
  url: string;
  domain: string;
  category: string;
  description: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // Check sessionStorage for auth
  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
  }, []);

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } else {
      setPwError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPwInput("");
  }

  // ---------- LOGIN SCREEN ----------
  if (!authed) {
    return (
      <div className="container" style={{ maxWidth: 400, marginTop: "6rem", marginBottom: "6rem" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: "0.82rem", marginTop: "0.3rem" }}>
              LocalBench AI — لوحة التحكم
            </p>
          </div>
          <input
            type="password"
            className="videos-search-input"
            style={{ textAlign: "center", padding: "0.75rem 1rem", marginBottom: "0.75rem" }}
            placeholder="كلمة المرور"
            value={pwInput}
            onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {pwError && (
            <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginBottom: "0.5rem", textAlign: "center" }}>
              كلمة مرور خاطئة
            </p>
          )}
          <button onClick={handleLogin} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            دخول
          </button>
          <Link href="/" style={{ display: "block", textAlign: "center", marginTop: "1rem", color: "var(--text-3)", fontSize: "0.8rem" }}>
            ← العودة للموقع
          </Link>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>
            ⚙️ Admin Dashboard
          </h1>
          <p style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>
            إدارة الفيديوهات والمصادر
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: "0.8rem" }}>
          خروج
        </button>
      </div>

      {/* Tabs */}
      <TabSection />
    </div>
  );
}

// ============================================================
// TAB SECTION
// ============================================================

function TabSection() {
  const [tab, setTab] = useState<"videos" | "resources">("videos");

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setTab("videos")}
          className={`filter-pill ${tab === "videos" ? "filter-pill-active" : "filter-pill-inactive"}`}
          style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          📺 الفيديوهات
        </button>
        <button
          onClick={() => setTab("resources")}
          className={`filter-pill ${tab === "resources" ? "filter-pill-active" : "filter-pill-inactive"}`}
          style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          📚 المصادر
        </button>
      </div>

      {tab === "videos" ? <VideosManager /> : <ResourcesManager />}
    </div>
  );
}

// ============================================================
// VIDEOS MANAGER
// ============================================================

function VideosManager() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeId, setYoutubeId] = useState("");

  function loadVideos() {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((d) => { setVideos(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(loadVideos, []);

  function resetForm() {
    setSlug(""); setTitle(""); setDescription(""); setCategory(""); setYoutubeId("");
    setEditingSlug(null);
    setShowForm(false);
  }

  // Start edit — يجيب الفيديو كامل ويملأ الفورم
  async function handleEdit(v: VideoItem) {
    setEditingSlug(v.slug);
    setShowForm(true);
    setMsg(null);

    // GET full video data
    try {
      const res = await fetch(`/api/videos/${v.slug}`);
      const data = await res.json();
      setTitle(data.title || "");
      setDescription(data.description || "");
      setCategory(data.category || "");
      setYoutubeId(data.youtubeId || "");
      setSlug(v.slug);
    } catch {
      setMsg({ type: "err", text: "❌ فشل تحميل بيانات الفيديو" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // Edit mode
    if (editingSlug) {
      const res = await fetch(`/api/videos/${editingSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, youtubeId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "ok", text: `✅ تم تعديل "${title}"` });
        resetForm();
        loadVideos();
      } else {
        setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` });
      }
      return;
    }

    // Add mode
    const finalSlug = slug || title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "").slice(0, 60);

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: finalSlug, title, description, category, youtubeId }),
    });
    const data = await res.json();

    if (res.ok) {
      setMsg({ type: "ok", text: `✅ تم إضافة "${title}"` });
      resetForm();
      loadVideos();
    } else {
      setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` });
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`حذف "${slug}"؟`)) return;
    const res = await fetch("/api/videos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setMsg({ type: "ok", text: `🗑️ تم حذف "${slug}"` });
      loadVideos();
    }
  }

  return (
    <div>
      {msg && (
        <div style={{
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          borderRadius: "8px",
          background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: msg.type === "ok" ? "var(--success)" : "var(--danger)",
          fontSize: "0.85rem",
        }}>
          {msg.text}
        </div>
      )}

      {/* Add/Edit button */}
      {!showForm && (
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn btn-primary"
          style={{ marginBottom: "1.5rem" }}
        >
          + إضافة فيديو
        </button>
      )}

      {/* Form (Add or Edit) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700 }}>
              {editingSlug ? `✏️ تعديل: ${editingSlug}` : "فيديو جديد"}
            </h3>
            <button type="button" onClick={resetForm} className="btn btn-ghost" style={{ fontSize: "0.78rem" }}>✕ إغلاق</button>
          </div>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <AdminInput label="العنوان *" value={title} onChange={setTitle} placeholder="مثال: تجربة Qwen 3 على AMD" required />
            <AdminInput label="YouTube Video ID *" value={youtubeId} onChange={setYoutubeId} placeholder="مثال: YQR6u0Gwdao" required />
            {!editingSlug && (
              <AdminInput label="Slug (اختياري — يتولد تلقائياً)" value={slug} onChange={setSlug} placeholder="qwen3-amd-test" />
            )}
            <AdminInput label="التصنيف" value={category} onChange={setCategory} placeholder="اختبار LLM" />
            <AdminTextarea label="الوصف" value={description} onChange={setDescription} placeholder="وصف الفيديو..." />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">
              {editingSlug ? "💾 حفظ التعديلات" : "حفظ"}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-ghost">إلغاء</button>
          </div>
          {!editingSlug && (
            <p style={{ color: "var(--text-3)", fontSize: "0.72rem", marginTop: "0.75rem" }}>
              💡 الـ prompts والـ output files تقدر تضيفها بعدين من MongoDB Atlas أو API
            </p>
          )}
        </form>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {videos.map((v) => (
            <div key={v.slug} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", background: "#4f80ff14", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>
                    {v.category}
                  </span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.68rem" }}>{v.date}</span>
                </div>
                <h4 style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {v.title}
                </h4>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.modelCount} models</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.promptCount} prompts</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.fileCount} files</span>
                </div>
              </div>
              {/* Edit + Delete buttons */}
              <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                <button
                  onClick={() => handleEdit(v)}
                  style={{
                    background: "rgba(79,128,255,0.1)",
                    border: "1px solid rgba(79,128,255,0.3)",
                    borderRadius: "6px",
                    padding: "0.4rem 0.6rem",
                    cursor: "pointer",
                    color: "var(--accent)",
                  }}
                  title="تعديل"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(v.slug)}
                  style={{
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: "6px",
                    padding: "0.4rem 0.6rem",
                    cursor: "pointer",
                    color: "var(--danger)",
                  }}
                  title="حذف"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// RESOURCES MANAGER
// ============================================================

function ResourcesManager() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  function loadResources() {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((d) => { setResources(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(loadResources, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, description, category }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: "ok", text: `✅ تم إضافة "${title}"` });
      setTitle(""); setUrl(""); setDescription(""); setCategory("");
      setShowForm(false);
      loadResources();
    } else {
      setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` });
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("حذف؟")) return;
    const res = await fetch("/api/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) { setMsg({ type: "ok", text: "🗑️ تم الحذف" }); loadResources(); }
  }

  return (
    <div>
      {msg && (
        <div style={{
          padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px",
          background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: msg.type === "ok" ? "var(--success)" : "var(--danger)",
          fontSize: "0.85rem",
        }}>
          {msg.text}
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>
        {showForm ? "إلغاء" : "+ إضافة مصدر"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>مصدر جديد</h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <AdminInput label="العنوان *" value={title} onChange={setTitle} placeholder="مثال: Ollama" required />
            <AdminInput label="URL *" value={url} onChange={setUrl} placeholder="https://ollama.com" required />
            <AdminInput label="التصنيف" value={category} onChange={setCategory} placeholder="محركات تشغيل" />
            <AdminTextarea label="الوصف" value={description} onChange={setDescription} placeholder="وصف المورد..." />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">حفظ</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">إلغاء</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {resources.map((r) => (
            <div key={r.url} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", background: "#4f80ff14", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>
                    {r.category}
                  </span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>{r.domain}</span>
                </div>
                <h4 style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600 }}>{r.title}</h4>
                <p style={{ color: "var(--text-2)", fontSize: "0.78rem", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.description}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.url)}
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "var(--danger)", flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function AdminInput({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="videos-search-input"
        style={{ padding: "0.6rem 0.85rem" }}
      />
    </div>
  );
}

function AdminTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="videos-search-input"
        style={{ padding: "0.6rem 0.85rem", resize: "vertical", fontFamily: "inherit" }}
      />
    </div>
  );
}
