export interface Model {
  name: string;
  quantization?: string;
  hardware?: string;
  provider?: string;
  type: "local" | "cloud";
}

export interface Prompt {
  id: number;
  title: string;
  content: string;
}

export interface OutputFile {
  id: number;
  modelName: string;
  promptTitle: string;
  previewHtml: string;
  sourceCode: string;
}

export interface Video {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  youtubeId: string;
  thumbnail: string;
  models: Model[];
  prompts: Prompt[];
  files: OutputFile[];
}

export interface Resource {
  title: string;
  description: string;
  url: string;
  domain: string;
  category: string;
}
