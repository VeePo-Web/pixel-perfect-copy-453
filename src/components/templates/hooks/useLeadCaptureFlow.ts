import { useCallback, useEffect, useRef, useState } from "react";
import type { TemplateItem } from "../content";
import { captureLead, type LeadSubmitPayload } from "../../../lib/leads";

export type LeadFlowState =
  | { kind: "closed" }
  | { kind: "form"; template: TemplateItem }
  | { kind: "sending"; template: TemplateItem }
  | { kind: "success"; template: TemplateItem };

const DOWNLOAD_KEY = "mfd.templateDownloaded";

export function useLeadCaptureFlow() {
  const [state, setState] = useState<LeadFlowState>({ kind: "closed" });
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Keep a live ref so submit() reads the current template without stale closures.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    try {
      setHasDownloaded(sessionStorage.getItem(DOWNLOAD_KEY) === "1");
    } catch {
      /* noop */
    }
  }, []);

  const open = useCallback((template: TemplateItem) => {
    setState({ kind: "form", template });
  }, []);

  const close = useCallback(() => setState({ kind: "closed" }), []);

  const submit = useCallback(async (payload: LeadSubmitPayload) => {
    const current = stateRef.current;
    if (current.kind !== "form") return;
    const template = current.template;

    setState({ kind: "sending", template });

    // Real capture — owned source of truth. UX proceeds regardless so the
    // visitor always reaches their template (no lost lead, no dead end).
    await captureLead({
      ...payload,
      templateId: template.id,
      templateName: template.shortName,
    });

    try {
      sessionStorage.setItem(DOWNLOAD_KEY, "1");
    } catch {
      /* noop */
    }
    setHasDownloaded(true);
    setState({ kind: "success", template });
  }, []);

  return { state, open, close, submit, hasDownloaded };
}
