"use client";

import { useState, useEffect } from "react";

// ============================================================
// GPUS MANAGER
// ============================================================
interface Gpu { name: string; vram: string; tier: string; notes: string; }

export function GpusManager() {
  const [gpus, setGpus] = useState<Gpu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [name, setName] = useState(""); const [vram, setVram] = useState("");
  const [tier, setTier] = useState(""); const [notes, setNotes] = useState("");

  function load() {
    fetch("/api/gpus").then(r => r.json()).then(d => { setGpus(d); setLoading(false); }).catch(() => setLoading(false));
  }
  useEffect(load, []);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const res = await fetch("/api/gpus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, vram, tier, notes }) });
    const d = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `✅ تم إضافة "${name}"` }); setName(""); setVram(""); setTier(""); setNotes(""); setShowForm(false); load(); }
    else setMsg({ type: "err", text: `❌ ${d.error}` });
  }

  async function del(name: string) {
    if (!confirm(`حذف "${name}"؟`)) return;
    await fetch("/api/gpus", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    setMsg({ type: "ok", text: `🗑️ تم حذف "${name}"` }); load();
  }

  return (
    <div>
      {msg && <MsgBox type={msg.type} text={msg.text} />}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>{showForm ? "إلغاء" : "+ إضافة كارت"}</button>
      {showForm && (
        <form onSubmit={add} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>كارت جديد</h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <Field label="الاسم *" value={name} onChange={setName} placeholder="RTX 4090" required />
            <Field label="VRAM *" value={vram} onChange={setVram} placeholder="24GB" required />
            <Field label="المستوى" value={tier} onChange={setTier} placeholder="الأفضل" />
            <FieldArea label="ملاحظات" value={notes} onChange={setNotes} placeholder="..." />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}><button type="submit" className="btn btn-primary">حفظ</button><button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">إلغاء</button></div>
        </form>
      )}
      {loading ? <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {gpus.map(g => (
            <RowCard key={g.name} title={g.name} subtitle={`${g.vram} · ${g.tier}`} desc={g.notes} onDelete={() => del(g.name)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SETUP MANAGER
// ============================================================
export function SetupManager() {
  const [specs, setSpecs] = useState("");
  const [software, setSoftware] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/setup").then(r => r.json()).then(d => {
      setSpecs(JSON.stringify(d.specs || [], null, 2));
      setSoftware((d.software || []).join(", "));
      setNote(d.note || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    try {
      const specsArr = JSON.parse(specs);
      const swArr = software.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/setup", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ specs: specsArr, software: swArr, note }) });
      const d = await res.json();
      if (res.ok) setMsg({ type: "ok", text: "✅ تم حفظ الإعدادات" });
      else setMsg({ type: "err", text: `❌ ${d.error}` });
    } catch { setMsg({ type: "err", text: "❌ خطأ في JSON" }); }
  }

  if (loading) return <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p>;

  return (
    <div>
      {msg && <MsgBox type={msg.type} text={msg.text} />}
      <form onSubmit={save} className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>تعديل الإعدادات</h3>
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>المواصفات (JSON)</label>
            <textarea value={specs} onChange={e => setSpecs(e.target.value)} rows={10} className="videos-search-input" style={{ padding: "0.6rem 0.85rem", resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }} />
          </div>
          <Field label="البرمجيات (افصل بفاصلة)" value={software} onChange={setSoftware} placeholder="llama.cpp, Ollama, LM Studio" />
          <FieldArea label="ملاحظة AMD" value={note} onChange={setNote} placeholder="..." />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>💾 حفظ</button>
      </form>
    </div>
  );
}

// ============================================================
// LEADERBOARD / BENCHMARKS MANAGER
// ============================================================
interface Bench { _id: string; model_name: string; final_score: number; tokens_per_sec: number; ttft_ms: number; vram_peak_mb: number; created_at: string; }

export function LeaderboardManager() {
  const [benches, setBenches] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [modelName, setModelName] = useState(""); const [score, setScore] = useState("");
  const [tokensPerSec, setTokensPerSec] = useState(""); const [ttftMs, setTtftMs] = useState("");
  const [vramMb, setVramMb] = useState("");

  function load() {
    fetch("/api/benchmarks?limit=100").then(r => r.json()).then(d => { setBenches(d); setLoading(false); }).catch(() => setLoading(false));
  }
  useEffect(load, []);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    const res = await fetch("/api/benchmarks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      model_name: modelName, final_score: parseFloat(score) || 0, tokens_per_sec: parseFloat(tokensPerSec) || 0,
      ttft_ms: parseInt(ttftMs) || 0, vram_peak_mb: parseInt(vramMb) || 0,
    }) });
    const d = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `✅ تم إضافة نتيجة لـ "${modelName}"` }); setModelName(""); setScore(""); setTokensPerSec(""); setTtftMs(""); setVramMb(""); setShowForm(false); load(); }
    else setMsg({ type: "err", text: `❌ ${d.error}` });
  }

  async function del(id: string) {
    if (!confirm("حذف؟")) return;
    await fetch("/api/benchmarks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMsg({ type: "ok", text: "🗑️ تم الحذف" }); load();
  }

  return (
    <div>
      {msg && <MsgBox type={msg.type} text={msg.text} />}
      <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ marginBottom: "1.5rem" }}>{showForm ? "إلغاء" : "+ إضافة نتيجة"}</button>
      {showForm && (
        <form onSubmit={add} className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>نتيجة benchmark جديدة</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <Field label="اسم النموذج *" value={modelName} onChange={setModelName} placeholder="Qwen 3.5 9B" required />
            <Field label="الدرجة" value={score} onChange={setScore} placeholder="85.3" />
            <Field label="Tokens/Sec" value={tokensPerSec} onChange={setTokensPerSec} placeholder="31.2" />
            <Field label="TTFT (ms)" value={ttftMs} onChange={setTtftMs} placeholder="320" />
            <Field label="VRAM Peak (MB)" value={vramMb} onChange={setVramMb} placeholder="6144" />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}><button type="submit" className="btn btn-primary">حفظ</button><button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">إلغاء</button></div>
        </form>
      )}
      {loading ? <p style={{ color: "var(--text-3)" }}>جاري التحميل...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {benches.map(b => (
            <RowCard key={b._id} title={b.model_name} subtitle={`${b.final_score || 0} pts · ${b.tokens_per_sec || 0} tok/s · ${b.ttft_ms || 0}ms`} desc={`${(b.vram_peak_mb / 1024).toFixed(1)} GB VRAM`} onDelete={() => del(b._id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SHARED HELPERS
// ============================================================
function MsgBox({ type, text }: { type: "ok" | "err"; text: string }) {
  return (
    <div style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "8px",
      background: type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
      border: `1px solid ${type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
      color: type === "ok" ? "var(--success)" : "var(--danger)", fontSize: "0.85rem" }}>
      {text}
    </div>
  );
}

function RowCard({ title, subtitle, desc, onDelete }: { title: string; subtitle: string; desc: string; onDelete: () => void; }) {
  return (
    <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", background: "#4f80ff14", padding: "0.1rem 0.5rem", borderRadius: "4px" }}>{subtitle}</span>
        </div>
        <h4 style={{ color: "var(--text)", fontSize: "0.88rem", fontWeight: 600 }}>{title}</h4>
        {desc && <p style={{ color: "var(--text-2)", fontSize: "0.78rem", marginTop: "0.2rem" }}>{desc}</p>}
      </div>
      <button onClick={onDelete} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "var(--danger)", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; }) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="videos-search-input" style={{ padding: "0.6rem 0.85rem" }} />
    </div>
  );
}

function FieldArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div>
      <label style={{ display: "block", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="videos-search-input" style={{ padding: "0.6rem 0.85rem", resize: "vertical", fontFamily: "inherit" }} />
    </div>
  );
}
