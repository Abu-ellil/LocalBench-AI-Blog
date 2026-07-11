export const metadata = {
  title: "إعداداتي — ModelBench",
  description: "تفاصيل الجهاز والإعداد المستخدم في الاختبارات",
};

export default function SetupPage() {
  const specs = [
    {
      label: "المعالج",
      value: "Intel Core i5-12400",
      sub: "12th Gen · 6 أنوية / 12 مسار",
      icon: "cpu",
    },
    {
      label: "الذاكرة",
      value: "24GB DDR4",
      sub: "لتشغيل النماذج والتطبيقات",
      icon: "ram",
    },
    {
      label: "كارت الشاشة",
      value: "AMD Radeon RX 6600 XT",
      sub: "8GB VRAM · RDNA 2",
      icon: "gpu",
    },
  ];

  const software = ["llama.cpp (Vulkan)", "Ollama", "LM Studio", "KoboldCpp"];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>إعداداتي</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            تفاصيل الجهاز والإعداد المستخدم في جميع اختبارات ModelBench.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Hardware Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {specs.map((spec) => (
            <div key={spec.label} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div className="resource-icon" style={{ width: 32, height: 32 }}>
                  {spec.icon === "cpu" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <rect x="9" y="9" width="6" height="6" />
                      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
                      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
                    </svg>
                  )}
                  {spec.icon === "ram" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 9h20v8H2z" /><path d="M5 17v2M9 17v2M15 17v2M19 17v2" />
                      <line x1="6" y1="13" x2="10" y2="13" /><line x1="14" y1="13" x2="18" y2="13" />
                    </svg>
                  )}
                  {spec.icon === "gpu" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="8" cy="12" r="2.5" /><circle cx="16" cy="12" r="2.5" />
                    </svg>
                  )}
                </div>
                <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {spec.label}
                </h3>
              </div>
              <p style={{ color: "var(--text)", fontSize: "1.05rem", fontWeight: 700 }}>{spec.value}</p>
              <p style={{ color: "var(--text-2)", fontSize: "0.82rem", marginTop: "0.3rem" }}>{spec.sub}</p>
            </div>
          ))}
        </div>

        {/* VRAM Note */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            borderLeft: "3px solid var(--warning)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p style={{ color: "var(--warning)", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                ملاحظة بخصوص AMD GPU
              </p>
              <p style={{ color: "var(--text-2)", fontSize: "0.84rem", lineHeight: 1.6 }}>
                كارت RX 6600 XT بـ 8GB VRAM من AMD — ده معناه إن GPU offload
                بيشتغل عبر <strong style={{ color: "var(--text)" }}>Vulkan</strong> أو{" "}
                <strong style={{ color: "var(--text)" }}>ROCm</strong> (مش CUDA زي NVIDIA).
                النماذج اللي بتشتغل كويس: <strong style={{ color: "var(--accent)" }}>3B–8B</strong> بـ
                Q4_K_M / Q5_K_M. للنماذج الأكبر (13B+) هتحتاج CPU offload جزئي.
              </p>
            </div>
          </div>
        </div>

        {/* Software Stack */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            البرمجيات
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {software.map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text-2)",
                  border: "1px solid var(--border)",
                  background: "#ffffff06",
                  borderRadius: "4px",
                  padding: "0.16rem 0.5rem",
                  fontWeight: 700,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
