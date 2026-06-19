import { useCallback, useEffect, useState } from "react";
import type { TemplateItem } from "../content";

export type LeadFlowState =
  | { kind: "closed" }
  | { kind: "form"; template: TemplateItem }
  | { kind: "sending"; template: TemplateItem }
  | { kind: "success"; template: TemplateItem };

const DOWNLOAD_KEY = "mfd.templateDownloaded";

export function useLeadCaptureFlow() {
  const [state, setState] = useState<LeadFlowState>({ kind: "closed" });
  const [hasDownloaded, setHasDownloaded] = useState(false);

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

  const submit = useCallback(() => {
    setState((s) => (s.kind === "form" ? { kind: "sending", template: s.template } : s));
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setState((s) => {
          if (s.kind === "sending") {
            try {
              sessionStorage.setItem(DOWNLOAD_KEY, "1");
            } catch {
              /* noop */
            }
            setHasDownloaded(true);
            return { kind: "success", template: s.template };
          }
          return s;
        });
        resolve();
      }, 750);
    });
  }, []);

  return { state, open, close, submit, hasDownloaded };
}
