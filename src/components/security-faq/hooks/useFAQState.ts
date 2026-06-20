import { useEffect, useMemo, useState } from "react";
import { faqItems, faqCategories, FAQCategoryId } from "../content";
import { track } from "../analytics";

export type CategoryFilter = "all" | FAQCategoryId;

export function useFAQState() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqItems.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      const catLabel =
        faqCategories.find((c) => c.id === item.category)?.label ?? "";
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        catLabel.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  // Debounced analytics for search
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => {
      track("faq_search_used", { query: query.trim() });
    }, 600);
    return () => clearTimeout(t);
  }, [query]);

  const selectCategory = (id: CategoryFilter) => {
    setCategory(id);
    setOpenId(null);
    track("faq_category_selected", { category: id });
  };

  const toggle = (id: string, q: string) => {
    setOpenId((current) => {
      const next = current === id ? null : id;
      if (next) {
        track("faq_opened", { id, question: q });
        try {
          history.replaceState(null, "", `#/security-faq#${id}`);
        } catch {
          /* noop */
        }
      }
      return next;
    });
  };

  return {
    query,
    setQuery,
    category,
    selectCategory,
    openId,
    toggle,
    filtered,
  };
}
