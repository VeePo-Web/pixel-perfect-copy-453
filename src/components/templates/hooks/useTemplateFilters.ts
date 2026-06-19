import { useMemo, useState } from "react";
import { templates, categories, recommendedPaths, type TemplateCategory } from "../content";

export function useTemplateFilters() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [highlightPathId, setHighlightPathId] = useState<string | null>(null);

  const highlightedTemplateIds = useMemo(() => {
    if (!highlightPathId) return new Set<string>();
    const path = recommendedPaths.find((p) => p.id === highlightPathId);
    return new Set<string>(path?.templateIds ?? []);
  }, [highlightPathId]);

  const visible = useMemo(() => {
    if (category === "All") return templates;
    return templates.filter((t) => t.category === (category as TemplateCategory));
  }, [category]);

  return {
    category,
    setCategory,
    highlightPathId,
    setHighlightPathId,
    highlightedTemplateIds,
    visible,
  };
}
