import BusinessPromptInput from "./BusinessPromptInput";
import DemoBusinessSelector from "./DemoBusinessSelector";
import BriefingPanelPreview from "./BriefingPanelPreview";
import type { DemoBusiness } from "../content";

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;
  businessId: string;
  selectBusiness: (id: string) => void;
  onGenerate: () => void;
  onUseDemo: () => void;
  business: DemoBusiness;
  status: "idle" | "loading" | "ready";
  loaderIndex: number;
};

export default function SampleBriefingHero(props: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.05] bg-charcoal-950">
      {/* ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:pt-32 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1.1fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Sample bi-weekly finance briefing
            </div>
            <h1 className="mt-5 max-w-[18ch] font-light text-bone text-[40px] leading-[1.05] tracking-[-0.01em] sm:text-[52px] lg:text-[60px]">
              See what financial clarity feels like before you apply.
            </h1>
            <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-bone/70">
              Choose a demo business or describe your own situation to preview a plain-English finance briefing — no bank connection required.
            </p>

            <div className="mt-8">
              <div className="mb-3 text-[10.5px] uppercase tracking-[0.22em] text-bone/45">
                Pick an industry
              </div>
              <DemoBusinessSelector selectedId={props.businessId} onSelect={props.selectBusiness} />
            </div>

            <div className="mt-6">
              <BusinessPromptInput
                value={props.prompt}
                onChange={props.setPrompt}
                onGenerate={props.onGenerate}
                onUseDemo={props.onUseDemo}
              />
            </div>

            <p className="mt-4 max-w-[60ch] text-[11.5px] uppercase tracking-[0.2em] text-bone/40">
              Use demo data or rough non-sensitive numbers. No bank connection required for this preview.
            </p>
          </div>

          <div className="lg:sticky lg:top-24">
            <BriefingPanelPreview
              business={props.business}
              status={props.status}
              loaderIndex={props.loaderIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
