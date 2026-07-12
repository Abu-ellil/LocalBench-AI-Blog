"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GpusManager, SetupManager, LeaderboardManager } from "./managers";

const ADMIN_PASSWORD = "localbench-admin-2025";

interface VideoItem {
  slug: string; title: string; category: string; date: string; youtubeId: string;
  modelCount: number; promptCount: number; fileCount: number;
}
interface ResourceItem {
  title: string; url: string; domain: string; category: string; description: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
  }, []);

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } else { setPwError(true); }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPwInput("");
  }

  if (!authed) {
    return (
      <div className="container" style={{ maxWidth: 400, marginTop: "6rem", marginBottom: "6rem" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--text)" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--text-3)", fontSize: "0.82rem", marginTop: "0.3rem" }}>LocalBench AI — لوحة التحكم</p>
          </div>
          <input type="password" className="videos-search-input" style={{ textAlign: "center", padding: "0.75rem 1rem", marginBottom: "0.75rem" }}
            placeholder="كلمة المرور" value={pwInput}
            onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          {pwError && <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginBottom: "0.5rem", textAlign: "center" }}>كلمة مرور خاطئة</p>}
          <button onClick={handleLogin} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>دخول</button>
          <Link href="/" style={{ display: "block", textAlign: "center", marginTop: "1rem", color: "var(--text-3)", fontSize: "0.8rem" }}>← العودة للموقع</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>إدارة الفيديوهات والمصادر</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: "0.8rem" }}>خروج</button>
      </div>
      <TabSection />
    </div>
  );
}

// ============================================================
function TabSection() {
  const [tab, setTab] = useState<"videos" | "resources" | "gpus" | "setup" | "leaderboard">("videos");
  const tabs = [
    { id: "videos", icon: "📺", label: "الفيديوهات" },
    { id: "resources", icon: "📚", label: "المصادر" },
    { id: "leaderboard", icon: "📊", label: "المتصدرين" },
    { id: "gpus", icon: "💾", label: "كروت الشاشة" },
    { id: "setup", icon: "⚙️", label: "الإعدادات" },
  ] as const;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`filter-pill ${tab === t.id ? "filter-pill-active" : "filter-pill-inactive"}`}
            style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "videos" && <VideosManager />}
      {tab === "resources" && <ResourcesManager />}
      {tab === "leaderboard" && <LeaderboardManager />}
      {tab === "gpus" && <GpusManager />}
      {tab === "setup" && <SetupManager />}
    </div>
  );
}

// ============================================================
// VIDEOS MANAGER — قائمة + إضافة سريعة + حذف + تعديل (في صفحة منفصلة)
// ============================================================
function VideosManager() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function loadVideos() {
    fetch("/api/videos").then((r) => r.json()).then((d) => { setVideos(d); setLoading(false); }).catch(() => setLoading(false));
  }
  useEffect(loadVideos, []);

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "").slice(0, 60);
    const res = await fetch("/api/videos", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, youtubeId, category, description }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: "ok", text: `✅ تم إضافة "${title}" — اضغط ✏️ لتكملة البيانات` });
      setTitle(""); setYoutubeId(""); setCategory(""); setDescription("");
      setShowQuickAdd(false);
      loadVideos();
    } else {
      setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` });
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`حذف "${slug}"؟`)) return;
    const res = await fetch("/api/videos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    if (res.ok) { setMsg({ type: "ok", text: `🗑️ تم حذف "${slug}"` }); loadVideos(); }
  }

  return (
    <div>
      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px",
          background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: msg.type === "ok" ? "var(--success)" : "var(--danger)", fontSize: "0.85rem" }}>
          {msg.text}
        </div>
      )}

      <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>
        {showQuickAdd ? "إلغاء" : "+ إضافة فيديو"}
      </button>

      {showQuickAdd && (
        <form onSubmit={handleQuickAdd} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>إضافة سريعة</h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <SimpleInput label="العنوان *" value={title} onChange={setTitle} placeholder="عنوان الفيديو" required />
            <SimpleInput label="YouTube ID *" value={youtubeId} onChange={setYoutubeId} placeholder="YQR6u0Gwdao" required />
            <SimpleInput label="التصنيف" value={category} onChange={setCategory} placeholder="اختبار LLM" />
            <SimpleTextarea label="الوصف" value={description} onChange={setDescription} placeholder="وصف مختصر..." />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn btn-primary">إضافة +</button>
            <button type="button" onClick={() => setShowQuickAdd(false)} className="btn btn-ghost">إلغاء</button>
          </div>
          <p style={{ color: "var(--text-3)", fontSize: "0.72rem", marginTop: "0.75rem" }}>
            💡 بعد الإضافة، اضغط ✏️ عشان تعدّل الـ Models والـ Prompts والـ Files في صفحة منفصلة
          </p>
        </form>
      )}

      {loading ? (
        <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {videos.map((v) => (
            <div key={v.slug} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", background: "#4f80ff14", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>{v.category}</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.68rem" }}>{v.date}</span>
                </div>
                <h4 style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</h4>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.modelCount} models</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.promptCount} prompts</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.72rem" }}>{v.fileCount} files</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                <Link href={`/admin/edit/${encodeURIComponent(v.slug)}`} style={{ background: "rgba(79,128,255,0.1)", border: "1px solid rgba(79,128,255,0.3)", borderRadius: "6px", padding: "0.4rem 0.6rem", color: "var(--accent)", display: "flex", alignItems: "center" }} title="تعديل">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </Link>
                <button onClick={() => handleDelete(v.slug)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "var(--danger)" }} title="حذف">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
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
    fetch("/api/resources").then((r) => r.json()).then((d) => { setResources(d); setLoading(false); }).catch(() => setLoading(false));
  }
  useEffect(loadResources, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, url, description, category }) });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `✅ تم إضافة "${title}"` }); setTitle(""); setUrl(""); setDescription(""); setCategory(""); setShowForm(false); loadResources(); }
    else { setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` }); }
  }

  async function handleDelete(url: string) {
    if (!confirm("حذف؟")) return;
    const res = await fetch("/api/resources", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    if (res.ok) { setMsg({ type: "ok", text: "🗑️ تم الحذف" }); loadResources(); }
  }

  return (
    <div>
      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px",
          background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: msg.type === "ok" ? "var(--success)" : "var(--danger)", fontSize: "0.85rem" }}>
          {msg.text}
        </div>
      )}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>{showForm ? "إلغاء" : "+ إضافة مصدر"}</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>مصدر جديد</h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <SimpleInput label="العنوان *" value={title} onChange={setTitle} placeholder="Ollama" required />
            <SimpleInput label="URL *" value={url} onChange={setUrl} placeholder="https://ollama.com" required />
            <SimpleInput label="التصنيف" value={category} onChange={setCategory} placeholder="محركات تشغيل" />
            <SimpleTextarea label="الوصف" value={description} onChange={setDescription} placeholder="وصف المورد..." />
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
                  <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", background: "#4f80ff14", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>{r.category}</span>
                  <span style={{ color: "var(--text-3)", fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>{r.domain}</span>
                </div>
                <h4 style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600 }}>{r.title}</h4>
                <p style={{ color: "var(--text-2)", fontSize: "0.78rem", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.description}</p>
              </div>
              <button onClick={() => handleDelete(r.url)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "var(--danger)", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
function SimpleInput({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="videos-search-input" style={{ padding: "0.6rem 0.85rem" }} />
    </div>
  );
}

function SimpleTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="videos-search-input" style={{ padding: "0.6rem 0.85rem", resize: "vertical", fontFamily: "inherit" }} />
    </div>
  );
}
