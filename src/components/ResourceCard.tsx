import type { Resource } from "@/lib/types";

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener"
      className="resource-card surface-rise"
    >
      <div className="resource-card-title">{resource.title}</div>
      <div className="resource-card-desc">{resource.description}</div>
      <div className="resource-card-domain">{resource.domain}</div>
    </a>
  );
}
