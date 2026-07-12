"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ModelEntry {
  name: string; quantization: string; hardware: string; type: "local" | "cloud";
}
interface PromptEntry { id: number; title: string; content: string; }
interface FileEntry { id: number; modelName: string; promptTitle: string; previewHtml: string; sourceCode: string; }

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [prompts, setPrompts] = useState<PromptEntry[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([]);

  useEffect(() => {
    // Auth check
    if (sessionStorage.getItem("admin_authed") !== "1") {
      router.push("/admin");
      return;
    }
    fetch(`/api/videos/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setYoutubeId(data.youtubeId || "");
        setModels(data.models || []);
        setPrompts(data.prompts || []);
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch(() => {
        setMsg({ type: "err", text: "❌ فشل تحميل الفيديو" });
        setLoading(false);
      });
  }, [slug, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await fetch(`/api/videos/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, youtubeId, models, prompts, files }),
    });
    const data = await res.json();

    setSaving(false);
    if (res.ok) {
      setMsg({ type: "ok", text: "✅ تم الحفظ بنجاح" });
    } else {
      setMsg({ type: "err", text: `❌ ${data.error || "خطأ"}` });
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div className="lb-skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="lb-skeleton-row" style={{ height: "60px", animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginTop: "1rem", fontFamily: "var(--font-mono)" }}>
            جاري تحميل بيانات الفيديو...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 900 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <Link href="/admin" className="breadcrumb-link">← Admin</Link>
        <span style={{ color: "var(--text-3)" }}>/</span>
        <span style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>تعديل: {slug}</span>
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
        ✏️ تعديل الفيديو
      </h1>
      <p style={{ color: "var(--text-3)", fontSize: "0.82rem", marginBottom: "2rem" }}>
        {slug}
      </p>

      {msg && (
        <div style={{
          padding: "0.75rem 1rem", marginBottom: "1.5rem", borderRadius: "8px",
          background: msg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${msg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          color: msg.type === "ok" ? "var(--success)" : "var(--danger)",
          fontSize: "0.85rem",
        }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* ===================== BASIC INFO ===================== */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <SectionLabel>📋 المعلومات الأساسية</SectionLabel>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <AdminInput label="العنوان *" value={title} onChange={setTitle} placeholder="عنوان الفيديو" required />
            <AdminInput label="YouTube Video ID *" value={youtubeId} onChange={setYoutubeId} placeholder="YQR6u0Gwdao" required />
            <AdminInput label="التصنيف" value={category} onChange={setCategory} placeholder="اختبار LLM" />
            <AdminTextarea label="الوصف" value={description} onChange={setDescription} placeholder="وصف الفيديو..." />
          </div>
        </div>

        {/* ===================== MODELS ===================== */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <SectionLabel>🧠 النماذج المختبرة ({models.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {models.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "0.5rem", alignItems: "end" }}>
                <AdminInput label="الاسم" value={m.name} onChange={(v) => { const a = [...models]; a[i] = { ...a[i], name: v }; setModels(a); }} placeholder="Qwen 3.5 9B" />
                <AdminInput label="Quantization" value={m.quantization} onChange={(v) => { const a = [...models]; a[i] = { ...a[i], quantization: v }; setModels(a); }} placeholder="Q4_K_M" />
                <AdminInput label="العتاد" value={m.hardware} onChange={(v) => { const a = [...models]; a[i] = { ...a[i], hardware: v }; setModels(a); }} placeholder="RX 6600 XT" />
                <select
                  value={m.type}
                  onChange={(e) => { const a = [...models]; a[i] = { ...a[i], type: e.target.value as "local" | "cloud" }; setModels(a); }}
                  className="videos-search-input"
                  style={{ padding: "0.6rem 0.85rem", height: "38px", width: "90px" }}
                >
                  <option value="local">محلي</option>
                  <option value="cloud">سحابي</option>
                </select>
                <MiniBtn onClick={() => setModels(models.filter((_, j) => j !== i))} color="danger">🗑️</MiniBtn>
              </div>
            ))}
            <MiniBtn onClick={() => setModels([...models, { name: "", quantization: "", hardware: "", type: "local" }])} color="accent">+ إضافة نموذج</MiniBtn>
          </div>
        </div>

        {/* ===================== PROMPTS ===================== */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <SectionLabel>📝 الـ Prompts ({prompts.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {prompts.map((p, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", background: "var(--bg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>#{p.id}</span>
                  <MiniBtn onClick={() => setPrompts(prompts.filter((_, j) => j !== i))} color="danger">🗑️ حذف</MiniBtn>
                </div>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <AdminInput label="العنوان" value={p.title} onChange={(v) => { const a = [...prompts]; a[i] = { ...a[i], title: v }; setPrompts(a); }} placeholder="عنوان الـ prompt" />
                  <AdminTextarea label="نص الـ Prompt" value={p.content} onChange={(v) => { const a = [...prompts]; a[i] = { ...a[i], content: v }; setPrompts(a); }} placeholder="اكتب الـ prompt كامل..." />
                </div>
              </div>
            ))}
            <MiniBtn onClick={() => setPrompts([...prompts, { id: prompts.length + 1, title: "", content: "" }])} color="accent">+ إضافة Prompt</MiniBtn>
          </div>
        </div>

        {/* ===================== OUTPUT FILES ===================== */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <SectionLabel>📂 ملفات الإخراج / Live HTML ({files.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {files.map((f, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", background: "var(--bg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>#{f.id}</span>
                  <MiniBtn onClick={() => setFiles(files.filter((_, j) => j !== i))} color="danger">🗑️ حذف</MiniBtn>
                </div>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <AdminInput label="اسم النموذج" value={f.modelName} onChange={(v) => { const a = [...files]; a[i] = { ...a[i], modelName: v }; setFiles(a); }} placeholder="Qwen 3.5 9B" />
                    <AdminInput label="عنوان الـ Prompt" value={f.promptTitle} onChange={(v) => { const a = [...files]; a[i] = { ...a[i], promptTitle: v }; setFiles(a); }} placeholder="React Dashboard" />
                  </div>
                  <AdminTextarea label="HTML للمعاينة (Preview)" value={f.previewHtml} onChange={(v) => { const a = [...files]; a[i] = { ...a[i], previewHtml: v }; setFiles(a); }} placeholder="<!DOCTYPE html>..." />
                  <AdminTextarea label="الكود المصدري (Source Code)" value={f.sourceCode} onChange={(v) => { const a = [...files]; a[i] = { ...a[i], sourceCode: v }; setFiles(a); }} placeholder="import React..." />
                </div>
              </div>
            ))}
            <MiniBtn onClick={() => setFiles([...files, { id: files.length + 1, modelName: "", promptTitle: "", previewHtml: "", sourceCode: "" }])} color="accent">+ إضافة Output File</MiniBtn>
          </div>
        </div>

        {/* ===================== ACTIONS ===================== */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", position: "sticky", bottom: 0, background: "var(--bg)", padding: "1rem 0" }}>
          <Link href="/admin" className="btn btn-ghost">← رجوع</Link>
          <button type="button" onClick={() => router.push("/admin")} className="btn btn-outline">إلغاء</button>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: 140, justifyContent: "center" }}>
            {saving ? "جاري الحفظ..." : "💾 حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// SHARED UI (نسخة من admin/page.tsx)
// ============================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      color: "var(--accent)", fontSize: "0.78rem", fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.06em",
      fontFamily: "var(--font-mono)", marginBottom: "0.8rem",
      paddingBottom: "0.4rem", borderBottom: "1px solid var(--border)",
    }}>
      {children}
    </div>
  );
}

function MiniBtn({ children, onClick, color }: {
  children: React.ReactNode; onClick: () => void; color: "accent" | "danger";
}) {
  const styles = color === "accent"
    ? { background: "rgba(79,128,255,0.1)", border: "1px solid rgba(79,128,255,0.3)", color: "var(--accent)" }
    : { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "var(--danger)" };
  return (
    <button type="button" onClick={onClick} style={{
      ...styles, borderRadius: "6px", padding: "0.35rem 0.8rem",
      cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
      fontFamily: "inherit", width: "fit-content",
    }}>
      {children}
    </button>
  );
}

function AdminInput({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="videos-search-input" style={{ padding: "0.6rem 0.85rem" }} />
    </div>
  );
}

function AdminTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4}
        className="videos-search-input" style={{ padding: "0.6rem 0.85rem", resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }} />
    </div>
  );
}
