export const metadata = {
  title: "دليل كروت الشاشة — ModelBench",
  description: "دليل شامل لكروت الشاشة لتشغيل النماذج المحلية",
};

export default function GpusPage() {
  const gpus = [
    { name: "RX 7900 XTX", vram: "24GB", tier: "الأفضل", notes: "أقوى كارت AMD للمستهلك، ROCm/Vulkan ممتاز للموديلات حتى 33B بكمّم" },
    { name: "RX 6800 XT", vram: "16GB", tier: "جيد جداً", notes: "VRAM كبيرة بسعر ممتاز، خيار قوي للموديلات المتوسطة (7B-14B)" },
    { name: "RTX 3090", vram: "24GB", tier: "الأفضل", notes: "خيار NVIDIA ممتاز للموديلات حتى 70B بكمّم — CUDA support كامل" },
    { name: "RTX 4060 Ti", vram: "16GB", tier: "جيد جداً", notes: "VRAM ممتازة في فئة متوسطة، CUDA كامل" },
    { name: "RX 6600 XT", vram: "8GB", tier: "جيد", notes: "كارت الـ setup بتاعنا — مناسب للموديلات الصغيرة (3B-8B) بـ Q4/Q5 عبر Vulkan" },
    { name: "RTX 3060", vram: "12GB", tier: "جيد", notes: "خيار NVIDIA اقتصادي للمبتدئين مع CUDA كامل" },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-grid" />
        <div className="container" style={{ position: "relative" }}>
          <h1>دليل كروت الشاشة</h1>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", marginTop: "0.75rem" }}>
            دليل شامل لكروت الشاشة الاستهلاكية لتشغيل النماذج المحلية — AMD و NVIDIA.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "3rem" }}>
        {/* Backend Note */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <p style={{ color: "var(--text-2)", fontSize: "0.84rem", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>نصيحة:</strong> لكروت AMD استخدم{" "}
            <code>llama.cpp</code> مع <code>--vulkan</code> أو <code>--rocm</code>، أو{" "}
            <code>KoboldCpp</code>. لكروت NVIDIA استخدم <code>CUDA</code> مباشرة. الفرق
            الأساسي هو سرعة الـ inference ومدى توافق الـ GPU offload.
          </p>
        </div>

        {/* GPU Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {gpus.map((gpu) => (
            <div
              key={gpu.name}
              className="card"
              style={{
                padding: "1.25rem",
                ...(gpu.name === "RX 6600 XT" ? { borderColor: "var(--accent)", boxShadow: "0 0 0 1px #4f80ff38" } : {}),
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ color: "var(--text)", fontSize: "1.05rem", fontWeight: 700 }}>
                  {gpu.name}
                  {gpu.name === "RX 6600 XT" && (
                    <span style={{ color: "var(--accent)", fontSize: "0.68rem", fontFamily: "var(--font-mono)", marginRight: "0.5rem", verticalAlign: "middle" }}>
                      · جهازي
                    </span>
                  )}
                </h3>
                <span
                  className="badge"
                  style={{
                    color: gpu.tier === "الأفضل" ? "var(--success)" : gpu.tier === "جيد جداً" ? "var(--accent)" : "var(--warning)",
                    background: gpu.tier === "الأفضل" ? "#34d39914" : gpu.tier === "جيد جداً" ? "#4f80ff14" : "#fbbf2414",
                    border: `1px solid ${gpu.tier === "الأفضل" ? "#34d3993d" : gpu.tier === "جيد جداً" ? "#4f80ff3d" : "#fbbf243d"}`,
                  }}
                >
                  {gpu.tier}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--accent)",
                    border: "1px solid var(--border)",
                    background: "#ffffff06",
                    borderRadius: "4px",
                    padding: "0.16rem 0.5rem",
                    fontWeight: 700,
                  }}
                >
                  {gpu.vram} VRAM
                </span>
              </div>
              <p style={{ color: "var(--text-2)", fontSize: "0.82rem", lineHeight: 1.5 }}>{gpu.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
