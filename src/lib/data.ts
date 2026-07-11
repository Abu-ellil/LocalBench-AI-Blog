import type { Video, Resource } from "./types";

export const videos: Video[] = [
  {
    slug: "free-ai-assistant-lifetime",
    title: "AI Assistant مجاني مدى الحياة! 🚀 أفضل بديل مجاني لـ ChatGPT بدون اشتراك",
    description:
      "تعرف إنك تقدر تشغل مساعد ذكاء اصطناعي مجاني مدى الحياة على جهازك؟ في هذا الفيديو، أعرض أفضل بديل مجاني لـ ChatGPT بدون أي اشتراك — كله محلي وآمن.\n\n#LocalAI #ChatGPTAlternative #FreeAI #ModelBench #LocalBench",
    category: "أدوات مجانية",
    date: "18 سبتمبر 2025",
    youtubeId: "xp0HRJTBrbM",
    thumbnail: "https://img.youtube.com/vi/xp0HRJTBrbM/maxresdefault.jpg",
    models: [],
    prompts: [],
    files: [],
  },
  {
    slug: "connect-cloudcode-local-models",
    title: "أداة مجانية لربط CloudCode بموديلاتك المحلية في ثوانٍ!",
    description:
      "أداة مجانية تقدر بيها تربط CloudCode بموديلاتك المحلية في ثوانٍ معدودة — بدون تعقيد وبدون اشتراكات.\n\n#LocalAI #CloudCode #ModelBench #LocalBench",
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
    description:
      "دليل كامل لاختيار النموذج المناسب لجهازك — حسب كارت الشاشة والـ VRAM المتاح عندك. اكتشف المنهجية الصح لاختيار الموديل المثالي لاحتياجاتك.\n\nالإعداد:\n- AMD Radeon RX 6600 XT 8GB\n- Intel i5-12400\n- 24GB RAM\n\n#LocalAI #ModelBench #LocalBench #AI #ذكاء_اصطناعي",
    category: "دليل شامل",
    date: "أكتوبر 2025",
    youtubeId: "IjBw3jAPrIY",
    thumbnail: "https://img.youtube.com/vi/IjBw3jAPrIY/maxresdefault.jpg",
    models: [
      {
        name: "موديلات 3B-8B",
        quantization: "Q4_K_M / Q5_K_M",
        hardware: "RX 6600 XT 8GB",
        type: "local",
      },
    ],
    prompts: [],
    files: [],
  },
  {
    slug: "before-downloading-any-ai-model",
    title: "قبل ما تحمل أي موديل AI لازم تشوف الفيديو ده!",
    description:
      "نصائح مهمة جداً لازم تعرفها قبل ما تحمل أي نموذج ذكاء اصطناعي محلي. الفيديو ده هيوفر عليك وقت ومساحة وفلوس.\n\n#LocalAI #ModelBench #LocalBench #AI",
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
    description:
      "تجربة حية لنموذج Qwen 3.5 9B على كارت AMD Radeon RX 6600 XT بـ 8GB VRAM. شوف الأداء والسرعة ومدى توافق النموذج مع كروت AMD عبر Vulkan.\n\nالإعداد:\n- AMD Radeon RX 6600 XT 8GB\n- llama.cpp + Vulkan backend\n- Qwen 3.5 9B (Q4_K_M)\n\n#LocalAI #Qwen #AMD #ModelBench #LocalBench",
    category: "اختبار LLM",
    date: "أكتوبر 2025",
    youtubeId: "YQR6u0Gwdao",
    thumbnail: "https://img.youtube.com/vi/YQR6u0Gwdao/maxresdefault.jpg",
    models: [
      {
        name: "Qwen 3.5 9B",
        quantization: "Q4_K_M",
        hardware: "RX 6600 XT 8GB",
        type: "local",
      },
    ],
    prompts: [],
    files: [],
  },
  {
    slug: "qwen3-amd-rx6600xt-live-stream",
    title: "بث مباشر: تجربة Qwen 3.5 9B على AMD RX 6600 XT 8G",
    description:
      "بث مباشر أطول لتجربة نموذج Qwen 3.5 9B على كارت AMD Radeon RX 6600 XT — اختبارات أعمق وأسئلة من المشاهدين.\n\n#LocalAI #Qwen #AMD #Live #ModelBench #LocalBench",
    category: "بث مباشر",
    date: "أكتوبر 2025",
    youtubeId: "Pt3bMmllvbo",
    thumbnail: "https://img.youtube.com/vi/Pt3bMmllvbo/maxresdefault.jpg",
    models: [
      {
        name: "Qwen 3.5 9B",
        quantization: "Q4_K_M",
        hardware: "RX 6600 XT 8GB",
        type: "local",
      },
    ],
    prompts: [],
    files: [],
  },
];

export const resources: Resource[] = [
  {
    title: "QuantEval",
    description: "معيار مستقل للأوزان المفتوحة وتحليل التكميم لنماذج الذكاء الاصطناعي.",
    url: "https://github.com/quanteval",
    domain: "github.com",
    category: "أدوات قياس",
  },
  {
    title: "OpenCode",
    description: "وكيل برمجة AI مفتوح المصدر لسطر الأوامر و IDE وسطح المكتب. مفيد لاختبار النماذج المحلية والسحابية على مهام برمجة حقيقية.",
    url: "https://opencode.ai",
    domain: "opencode.ai",
    category: "أدوات برمجة",
  },
  {
    title: "llama.cpp",
    description: "تشغيل نماذج LLM محلياً باستخدام نماذج GGUF. ممتاز لاختبار النماذج المكممة واستنتاج CPU/GPU واستخراج الأداء من أجهزة المستهلك. يدعم Vulkan لكروت AMD.",
    url: "https://github.com/ggerganov/llama.cpp",
    domain: "github.com",
    category: "محركات تشغيل",
  },
  {
    title: "Hugging Face Models",
    description: "تصفح وتحميل ومقارنة النماذج المفتوحة والـ fine-tunes والبيانات وملفات GGUF وبطاقات النماذج وإصدارات المجتمع.",
    url: "https://huggingface.co/models",
    domain: "huggingface.co",
    category: "مصادر نماذج",
  },
  {
    title: "Ollama",
    description: "طريقة بسيطة لتشغيل النماذج المحلية مع تثبيت سريع وسحب نماذج سهل و API محلي للتطبيقات والأدوات.",
    url: "https://ollama.com",
    domain: "ollama.com",
    category: "محركات تشغيل",
  },
  {
    title: "KoboldCpp",
    description: "واجهة لتشغيل نماذج GGUF محلياً مع دعم Vulkan لكروت AMD و NVIDIA. خيار ممتاز لو كارتك من AMD.",
    url: "https://github.com/LostRuins/koboldcpp",
    domain: "github.com",
    category: "محركات تشغيل",
  },
];

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

export function getLatestVideos(count: number = 3): Video[] {
  return videos.slice(0, count);
}
