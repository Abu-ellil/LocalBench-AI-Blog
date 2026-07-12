/**
 * Migration script: ينقل كل البيانات من data.ts لـ MongoDB
 * Run: node migrate-to-mongodb.mjs
 */
import { MongoClient } from "mongodb";
import * as dns from "node:dns";
import { readFile } from "node:fs/promises";

// Fix DNS for Atlas
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "localbench";

const videos = [
  {
    slug: "free-ai-assistant-lifetime",
    title: "AI Assistant مجاني مدى الحياة! 🚀 أفضل بديل مجاني لـ ChatGPT بدون اشتراك",
    description: "تعرف إنك تقدر تشغل مساعد ذكاء اصطناعي مجاني مدى الحياة على جهازك؟ في هذا الفيديو، أعرض أفضل بديل مجاني لـ ChatGPT بدون أي اشتراك — كله محلي وآمن.\n\n#LocalAI #ChatGPTAlternative #FreeAI #ModelBench #LocalBench",
    category: "أدوات مجانية",
    date: "18 سبتمبر 2025",
    youtubeId: "xp0HRJTBrbM",
    thumbnail: "https://img.youtube.com/vi/xp0HRJTBrbM/maxresdefault.jpg",
    models: [],
    prompts: [
      { id: 1, title: "مساعد شخصي محلي", content: "أنت مساعد ذكاء اصطناعي محلي يعمل على جهازي بدون إنترنت.\n\nقواعدك:\n1. خلي الردود مختصرة ومفيدة\n2. اسأل توضيحات لو السؤال مش واضح\n3. اشتغل بالعربي والإنجليزي\n\nالسؤال: اكتبلي script بايثون ينسخ ملفات من مجلد لآخر مع logging" },
      { id: 2, title: "إعدادات الأمان في LM Studio", content: "System: أنت model محلي يعمل بـ GGUF Q4_K_M على AMD RX 6600 XT.\nContext window: 4096 tokens\nTemperature: 0.7\nTop-P: 0.9\n\nالمهمة: شرح إعدادات الأمان في LM Studio وكيفية تفعيل الـ local-only mode." },
    ],
    files: [],
  },
  {
    slug: "connect-cloudcode-local-models",
    title: "أداة مجانية لربط CloudCode بموديلاتك المحلية في ثوانٍ!",
    description: "أداة مجانية تقدر بيها تربط CloudCode بموديلاتك المحلية في ثوانٍ معدودة — بدون تعقيد وبدون اشتراكات.\n\n#LocalAI #CloudCode #ModelBench #LocalBench",
    category: "أدوات",
    date: "أكتوبر 2025",
    youtubeId: "ALY544RaK1Y",
    thumbnail: "https://img.youtube.com/vi/ALY544RaK1Y/maxresdefault.jpg",
    models: [],
    prompts: [],
    files: [],
  },
  {
    slug: "choose-right-model-for-your-pc",
    title: "إزاي تختار الموديل الصح لجهازك؟ (دليل كامل) كارت الشاشة بتاعك يقدر يشغل إيه؟",
    description: "دليل كامل لاختيار النموذج المناسب لجهازك — حسب كارت الشاشة والـ VRAM المتاح عندك. اكتشف المنهجية الصح لاختيار الموديل المثالي لاحتياجاتك.\n\nالإعداد:\n- AMD Radeon RX 6600 XT 8GB\n- Intel i5-12400\n- 24GB RAM\n\n#LocalAI #ModelBench #LocalBench #AI #ذكاء_اصطناعي",
    category: "دليل شامل",
    date: "أكتوبر 2025",
    youtubeId: "IjBw3jAPrIY",
    thumbnail: "https://img.youtube.com/vi/IjBw3jAPrIY/maxresdefault.jpg",
    models: [{ name: "موديلات 3B-8B", quantization: "Q4_K_M / Q5_K_M", hardware: "RX 6600 XT 8GB", type: "local" }],
    prompts: [
      { id: 1, title: "اختبار كتابة كود React", content: "اكتب React component لـ dashboard card بي display:\n- عنوان\n- قيمة رقمية كبيرة\n- شريط تقدم (progress bar)\n- badge للحالة\n\nاستخدم TypeScript + Tailwind CSS.\nخلي الـ component قابل لإعادة الاستخدام (reusable) بـ props." },
      { id: 2, title: "شرح الـ Quantization", content: "اشرحلي الفرق بين Q4_K_M و Q5_K_M و Q8_0 كأني مبتدئ.\n\nاستخدم أمثلة بسيطة (مثلاً: زي تصغير صورة من 4K لـ 1080p)\nوقولي أنهي quantization يناسب:\n1. جهاز بـ 8GB VRAM\n2. جهاز بـ 16GB VRAM\n3. جهاز بـ 24GB VRAM" },
      { id: 3, title: "حساب الـ VRAM المطلوب", content: "عايز أعرف هل أقدر أشغل موديل 9B parameters بـ Q4_K_M على كارت RX 6600 XT بـ 8GB VRAM؟\n\nاحسبلي:\n1. حجم الموديل بالـ GB بعد الـ quantization\n2. الـ VRAM المطلوب للـ context window (4096 tokens)\n3. هل فيه room كافي للـ KV cache؟\n4. إيه البديل لو ماينفعش؟" },
    ],
    files: [
      {
        id: 1,
        modelName: "Llama 3.2 3B (Q4_K_M)",
        promptTitle: "React Dashboard Card Component",
        previewHtml: "<!DOCTYPE html>\n<html><head><meta charset='UTF-8'><style>body{font-family:system-ui;background:#0a0e1a;color:#fff;padding:2rem;margin:0}.card{background:linear-gradient(135deg,#1a2035,#0c101e);border:1px solid #263050;border-radius:12px;padding:1.5rem;max-width:320px}.title{color:#8492b8;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem}.value{font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#4f80ff,#9b6dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:1rem}.bar-bg{height:6px;background:#111526;border-radius:3px;overflow:hidden;margin-bottom:0.75rem}.bar-fill{height:100%;width:75%;background:linear-gradient(90deg,#4f80ff,#9b6dff);border-radius:3px}.badge{display:inline-block;padding:0.2rem 0.6rem;background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);border-radius:20px;font-size:0.72rem;font-weight:600}</style></head><body><div class='card'><div class='title'>VRAM Usage</div><div class='value'>6.2 GB</div><div class='bar-bg'><div class='bar-fill'></div></div><span class='badge'>● Active</span></div></body></html>",
        sourceCode: "import React from 'react';\n\ninterface DashboardCardProps {\n  title: string;\n  value: string | number;\n  progress: number;\n  status: 'active' | 'idle' | 'error';\n}\n\nexport default function DashboardCard({ title, value, progress, status }: DashboardCardProps) {\n  const statusColors = { active: '#34d399', idle: '#fbbf24', error: '#f87171' };\n  return (\n    <div className=\"bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm\">\n      <p className=\"text-slate-400 text-xs uppercase tracking-wide\">{title}</p>\n      <p className=\"text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent\">{value}</p>\n      <div className=\"h-1.5 bg-slate-800 rounded-full overflow-hidden\">\n        <div className=\"h-full bg-gradient-to-r from-blue-500 to-purple-500\" style={{ width: `${progress}%` }} />\n      </div>\n      <span style={{ color: statusColors[status] }}>● {status}</span>\n    </div>\n  );\n}",
      },
    ],
  },
  {
    slug: "before-downloading-any-ai-model",
    title: "قبل ما تحمل أي موديل AI لازم تشوف الفيديو ده!",
    description: "نصائح مهمة جداً لازم تعرفها قبل ما تحمل أي نموذج ذكاء اصطناعي محلي. الفيديو ده هيوفر عليك وقت ومساحة وفلوس.\n\n#LocalAI #ModelBench #LocalBench #AI",
    category: "نصائح",
    date: "أكتوبر 2025",
    youtubeId: "7wWBpgF2mhM",
    thumbnail: "https://img.youtube.com/vi/7wWBpgF2mhM/maxresdefault.jpg",
    models: [],
    prompts: [],
    files: [],
  },
  {
    slug: "qwen3-amd-rx6600xt-test",
    title: "تجربة المودل المحلي Qwen 3 على كارت AMD RX 6600 XT 8G",
    description: "تجربة حية لنموذج Qwen 3.5 9B على كارت AMD Radeon RX 6600 XT بـ 8GB VRAM. شوف الأداء والسرعة ومدى توافق النموذج مع كروت AMD عبر Vulkan.\n\nالإعداد:\n- AMD Radeon RX 6600 XT 8GB\n- llama.cpp + Vulkan backend\n- Qwen 3.5 9B (Q4_K_M)\n\n#LocalAI #Qwen #AMD #ModelBench #LocalBench",
    category: "اختبار LLM",
    date: "أكتوبر 2025",
    youtubeId: "YQR6u0Gwdao",
    thumbnail: "https://img.youtube.com/vi/YQR6u0Gwdao/maxresdefault.jpg",
    models: [{ name: "Qwen 3.5 9B", quantization: "Q4_K_M", hardware: "RX 6600 XT 8GB", type: "local" }],
    prompts: [
      { id: 1, title: "كتابة API endpoint", content: "اكتب Express.js API endpoint لـ CRUD operations على resource اسمه 'benchmark'.\n\nالمطلوب:\n- GET /api/benchmarks — جميع النتائج\n- GET /api/benchmarks/:id — نتيجة واحدة\n- POST /api/benchmarks — إضافة نتيجة\n- PUT /api/benchmarks/:id — تحديث\n- DELETE /api/benchmarks/:id — حذف\n\nاستخدم TypeScript + Mongoose + proper error handling." },
      { id: 2, title: "شرح Vulkan vs CUDA", content: "اشرحلي الفرق بين Vulkan و CUDA في سياق تشغيل نماذج LLM محلياً.\n\nركّز على:\n1. ليه CUDA أسرع لكروت NVIDIA\n2. إزاي Vulkan بيخلي كروت AMD تشتغل\n3. الـ performance difference المتوقع\n4. إزاي أختار الـ backend الصح في llama.cpp" },
      { id: 3, title: "توليد صفحة هبوط", content: "صمم صفحة هبوط (landing page) لمنتج اسمه 'LocalAI Studio' — أداة لتشغيل نماذج AI محلياً.\n\nالصفحة لازم تحتوي على:\n- Hero section بـ headline قوي و CTA button\n- Features grid (3 ميزات)\n- Comparison table (LocalAI Studio vs Cloud AI)\n- Pricing section\n- Footer\n\nاستخدم HTML + Tailwind CSS (CDN). Dark theme." },
    ],
    files: [
      {
        id: 1,
        modelName: "Qwen 3.5 9B (Q4_K_M)",
        promptTitle: "Express.js CRUD API",
        previewHtml: "<!DOCTYPE html><html><head><meta charset='UTF-8'><style>body{font-family:'JetBrains Mono',monospace;background:#0a0e1a;color:#dde3f0;padding:2rem;margin:0}h1{color:#4f80ff;font-size:1.5rem;margin-bottom:1rem}.endpoint{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid #1a2035}.method{padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:700}.get{background:rgba(79,128,255,0.15);color:#4f80ff}.post{background:rgba(52,211,153,0.15);color:#34d399}.put{background:rgba(251,191,36,0.15);color:#fbbf24}.del{background:rgba(248,113,113,0.15);color:#f87171}.path{color:#8492b8;font-size:0.85rem}</style></head><body><h1>// Benchmark API Endpoints</h1><div class='endpoint'><span class='method get'>GET</span><span class='path'>/api/benchmarks</span></div><div class='endpoint'><span class='method get'>GET</span><span class='path'>/api/benchmarks/:id</span></div><div class='endpoint'><span class='method post'>POST</span><span class='path'>/api/benchmarks</span></div><div class='endpoint'><span class='method put'>PUT</span><span class='path'>/api/benchmarks/:id</span></div><div class='endpoint'><span class='method del'>DELETE</span><span class='path'>/api/benchmarks/:id</span></div></body></html>",
        sourceCode: "import express, { Request, Response } from 'express';\nimport mongoose from 'mongoose';\n\nconst app = express();\napp.use(express.json());\n\nconst benchmarkSchema = new mongoose.Schema({\n  model_name: { type: String, required: true },\n  final_score: Number,\n  tokens_per_sec: Number,\n  ttft_ms: Number,\n  vram_peak_mb: Number,\n  created_at: { type: Date, default: Date.now }\n});\n\nconst Benchmark = mongoose.model('Benchmark', benchmarkSchema);\n\napp.get('/api/benchmarks', async (req, res) => {\n  const results = await Benchmark.find().sort({ created_at: -1 });\n  res.json(results);\n});\n\n// ... CRUD endpoints\nexport default app;",
      },
      {
        id: 2,
        modelName: "Qwen 3.5 9B (Q4_K_M)",
        promptTitle: "Landing Page: LocalAI Studio",
        previewHtml: "<!DOCTYPE html><html dir='rtl'><head><meta charset='UTF-8'><style>body{font-family:system-ui;background:#070a14;color:#fff;margin:0;padding:0}.hero{text-align:center;padding:4rem 2rem;background:radial-gradient(circle at 50% 0,rgba(79,128,255,0.15),transparent 60%)}.hero h1{font-size:3rem;background:linear-gradient(135deg,#4f80ff,#9b6dff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:1rem}.hero p{color:#8492b8;font-size:1.2rem;max-width:600px;margin:0 auto 2rem}.cta{display:inline-block;padding:1rem 2.5rem;background:linear-gradient(135deg,#4f80ff,#9b6dff);border-radius:10px;color:#fff;text-decoration:none;font-weight:700;font-size:1.1rem}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:3rem 2rem;max-width:1000px;margin:0 auto}.feature{text-align:center;padding:2rem;background:#0c101e;border:1px solid #1a2035;border-radius:12px}.feature h3{color:#4f80ff;margin:0.5rem 0}</style></head><body><div class='hero'><h1>LocalAI Studio</h1><p>شغل نماذج الذكاء الاصطناعي على جهازك — مجاناً وبدون إنترنت</p><a href='#' class='cta'>حمّل الآن 🚀</a></div><div class='features'><div class='feature'><div style='font-size:2rem'>🔒</div><h3>خصوصية كاملة</h3><p>بياناتك مكتفية على جهازك</p></div><div class='feature'><div style='font-size:2rem'>⚡</div><h3>سرعة عالية</h3><p>استجابة فورية بدون إنترنت</p></div><div class='feature'><div style='font-size:2rem'>🆓</div><h3>مجاني 100%</h3><p>بدون اشتراكات أو رسوم</p></div></div></body></html>",
        sourceCode: "<!-- Landing Page generated by Qwen 3.5 9B -->\n<!DOCTYPE html>\n<html dir='rtl'>\n<head>\n  <meta charset='UTF-8'>\n  <title>LocalAI Studio</title>\n</head>\n<body>\n  <div class='hero'>\n    <h1>LocalAI Studio</h1>\n    <p>شغل نماذج الذكاء الاصطناعي على جهازك</p>\n    <a href='#' class='cta'>حمّل الآن</a>\n  </div>\n</body>\n</html>",
      },
    ],
  },
  {
    slug: "qwen3-amd-rx6600xt-live-stream",
    title: "بث مباشر: تجربة Qwen 3.5 9B على AMD RX 6600 XT 8G",
    description: "بث مباشر أطول لتجربة نموذج Qwen 3.5 9B على كارت AMD Radeon RX 6600 XT — اختبارات أعمق وأسئلة من المشاهدين.\n\n#LocalAI #Qwen #AMD #Live #ModelBench #LocalBench",
    category: "بث مباشر",
    date: "أكتوبر 2025",
    youtubeId: "Pt3bMmllvbo",
    thumbnail: "https://img.youtube.com/vi/Pt3bMmllvbo/maxresdefault.jpg",
    models: [{ name: "Qwen 3.5 9B", quantization: "Q4_K_M", hardware: "RX 6600 XT 8GB", type: "local" }],
    prompts: [],
    files: [],
  },
];

const resources = [
  { title: "QuantEval", description: "معيار مستقل للأوزان المفتوحة وتحليل التكميم لنماذج الذكاء الاصطناعي.", url: "https://github.com/quanteval", domain: "github.com", category: "أدوات قياس" },
  { title: "OpenCode", description: "وكيل برمجة AI مفتوح المصدر لسطر الأوامر و IDE وسطح المكتب. مفيد لاختبار النماذج المحلية والسحابية على مهام برمجة حقيقية.", url: "https://opencode.ai", domain: "opencode.ai", category: "أدوات برمجة" },
  { title: "llama.cpp", description: "تشغيل نماذج LLM محلياً باستخدام نماذج GGUF. ممتاز لاختبار النماذج المكممة واستنتاج CPU/GPU واستخراج الأداء من أجهزة المستهلك. يدعم Vulkan لكروت AMD.", url: "https://github.com/ggerganov/llama.cpp", domain: "github.com", category: "محركات تشغيل" },
  { title: "Hugging Face Models", description: "تصفح وتحميل ومقارنة النماذج المفتوحة والـ fine-tunes والبيانات وملفات GGUF وبطاقات النماذج وإصدارات المجتمع.", url: "https://huggingface.co/models", domain: "huggingface.co", category: "مصادر نماذج" },
  { title: "Ollama", description: "طريقة بسيطة لتشغيل النماذج المحلية مع تثبيت سريع وسحب نماذج سهل و API محلي للتطبيقات والأدوات.", url: "https://ollama.com", domain: "ollama.com", category: "محركات تشغيل" },
  { title: "KoboldCpp", description: "واجهة لتشغيل نماذج GGUF محلياً مع دعم Vulkan لكروت AMD و NVIDIA. خيار ممتاز لو كارتك من AMD.", url: "https://github.com/LostRuins/koboldcpp", domain: "github.com", category: "محركات تشغيل" },
];

async function main() {
  console.log("🔗 Connecting to MongoDB Atlas...");
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  const db = client.db(MONGODB_DB);
  console.log("✅ Connected to:", MONGODB_DB);

  // Migrate videos
  console.log("\n📺 Migrating videos...");
  const videosCol = db.collection("videos");
  for (const v of videos) {
    const existing = await videosCol.findOne({ slug: v.slug });
    if (existing) {
      console.log(`  ⏭️  ${v.slug} (already exists)`);
      continue;
    }
    await videosCol.insertOne({ ...v, created_at: new Date() });
    console.log(`  ✅ ${v.slug} — ${v.prompts.length} prompts, ${v.files.length} files`);
  }

  // Migrate resources
  console.log("\n📚 Migrating resources...");
  const resCol = db.collection("resources");
  for (const r of resources) {
    const existing = await resCol.findOne({ url: r.url });
    if (existing) {
      console.log(`  ⏭️  ${r.title} (already exists)`);
      continue;
    }
    await resCol.insertOne({ ...r, created_at: new Date() });
    console.log(`  ✅ ${r.title}`);
  }

  console.log("\n🎉 Migration complete!");
  console.log(`   Videos: ${await videosCol.countDocuments()}`);
  console.log(`   Resources: ${await resCol.countDocuments()}`);
  console.log(`   Benchmarks: ${await db.collection("benchmarks").countDocuments()}`);

  await client.close();
}

main().catch((e) => {
  console.error("❌ Migration failed:", e.message);
  process.exit(1);
});
