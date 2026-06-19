import React from "react";
import { motion } from "framer-motion";

interface InquiryForm {
  name: string;
  email: string;
  partner: string;
  date: string;
  venue: string;
  guests: string;
  service: string;
  referral: string;
  message: string;
}

interface InquireFormStepsProps {
  formData: InquiryForm;
  set: (field: keyof InquiryForm, value: string) => void;
  errors: Partial<Record<keyof InquiryForm, string>>;
  inputCls: (field: keyof InquiryForm) => string;
}

const serviceOptions = [
  { label: "Day-Of Coordination", desc: "You've planned it all — we execute flawlessly." },
  { label: "Partial Planning", desc: "Guidance where you need it, freedom where you don't." },
  { label: "Full-Service Planning", desc: "We handle every detail from vision to vow." },
  { label: "Not sure yet", desc: "Let's figure it out together on a call." },
];

const guestRanges = ["Under 50", "50–100", "100–150", "150–200", "200+"];

const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="input-gold-focus relative">{children}</div>
);

const PillSelect = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(value === opt ? "" : opt)}
        className={`px-5 py-2.5 font-sans-wedding text-xs tracking-[0.12em] uppercase font-light border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          value === opt
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-transparent text-brand-text-secondary border-border/60 hover:border-primary/40 hover:text-foreground"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const buildSteps = ({ formData, set, errors, inputCls }: InquireFormStepsProps): React.ReactNode[] => [
  /* Step 0 — About You */
  <div key="step-0" className="space-y-8">
    <div>
      <p className="font-overline text-primary/60 mb-1">About You</p>
      <h2 className="font-serif-wedding text-2xl md:text-3xl text-foreground font-light">
        Let's start with the basics.
      </h2>
    </div>
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="font-overline text-muted-foreground mb-2 block">Your Name *</label>
        <InputWrapper>
          <input type="text" id="name" name="name" value={formData.name} onChange={(e) => set("name", e.target.value)} className={inputCls("name")} placeholder="First & last name" autoFocus aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </InputWrapper>
        {errors.name && <p id="name-error" className="mt-1.5 font-sans-wedding text-xs text-destructive" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="partner" className="font-overline text-muted-foreground mb-2 block">Partner's Name</label>
        <InputWrapper>
          <input type="text" id="partner" name="partner" value={formData.partner} onChange={(e) => set("partner", e.target.value)} className={inputCls("partner")} placeholder="First & last name" />
        </InputWrapper>
      </div>
      <div>
        <label htmlFor="email" className="font-overline text-muted-foreground mb-2 block">Email Address *</label>
        <InputWrapper>
          <input type="email" id="email" name="email" value={formData.email} onChange={(e) => set("email", e.target.value)} className={inputCls("email")} placeholder="your@email.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </InputWrapper>
        {errors.email && <p id="email-error" className="mt-1.5 font-sans-wedding text-xs text-destructive" role="alert">{errors.email}</p>}
      </div>
    </div>
  </div>,

  /* Step 1 — Wedding Details */
  <div key="step-1" className="space-y-8">
    <div>
      <p className="font-overline text-primary/60 mb-1">Wedding Details</p>
      <h2 className="font-serif-wedding text-2xl md:text-3xl text-foreground font-light">Tell us about your day.</h2>
      <p className="font-sans-wedding text-sm text-brand-text-secondary font-light mt-2">All optional — share what you know so far.</p>
    </div>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="font-overline text-muted-foreground mb-2 block">Wedding Date</label>
          <InputWrapper><input type="text" id="date" name="date" value={formData.date} onChange={(e) => set("date", e.target.value)} className={inputCls("date")} placeholder="Month / Year or TBD" /></InputWrapper>
        </div>
        <div>
          <label htmlFor="venue" className="font-overline text-muted-foreground mb-2 block">Venue</label>
          <InputWrapper><input type="text" id="venue" name="venue" value={formData.venue} onChange={(e) => set("venue", e.target.value)} className={inputCls("venue")} placeholder="Venue name or TBD" /></InputWrapper>
        </div>
      </div>
      <div>
        <p className="font-overline text-muted-foreground mb-3">Estimated Guest Count</p>
        <PillSelect options={guestRanges} value={formData.guests || ""} onChange={(v) => set("guests", v)} />
      </div>
    </div>
  </div>,

  /* Step 2 — Service & Source */
  <div key="step-2" className="space-y-8">
    <div>
      <p className="font-overline text-primary/60 mb-1">Your Needs</p>
      <h2 className="font-serif-wedding text-2xl md:text-3xl text-foreground font-light">What kind of support are you looking for?</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {serviceOptions.map((svc) => (
        <button
          key={svc.label}
          type="button"
          onClick={() => set("service", formData.service === svc.label ? "" : svc.label)}
          className={`text-left p-5 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 group ${
            formData.service === svc.label ? "border-primary bg-primary/[0.04]" : "border-border/60 hover:border-primary/40"
          }`}
        >
          <p className={`font-sans-wedding text-sm font-light tracking-wide mb-1 transition-colors ${formData.service === svc.label ? "text-foreground" : "text-foreground/80"}`}>{svc.label}</p>
          <p className="font-sans-wedding text-xs text-brand-text-secondary font-light leading-relaxed">{svc.desc}</p>
        </button>
      ))}
    </div>
    <div>
      <label htmlFor="referral" className="font-overline text-muted-foreground mb-2 block">How Did You Find Us?</label>
      <InputWrapper><input type="text" id="referral" name="referral" value={formData.referral} onChange={(e) => set("referral", e.target.value)} className={inputCls("referral")} placeholder="Instagram, referral, Google…" /></InputWrapper>
    </div>
  </div>,

  /* Step 3 — Vision & Submit */
  <div key="step-3" className="space-y-8">
    <div>
      <p className="font-overline text-primary/60 mb-1">Your Vision</p>
      <h2 className="font-serif-wedding text-2xl md:text-3xl text-foreground font-light">Anything else you'd like us to know?</h2>
      <p className="font-sans-wedding text-sm text-brand-text-secondary font-light mt-2">Totally optional — we'll cover everything on our discovery call.</p>
    </div>
    <div>
      <label htmlFor="message" className="font-overline text-muted-foreground mb-2 block">Tell Us About Your Vision</label>
      <InputWrapper>
        <textarea id="message" name="message" rows={5} value={formData.message} onChange={(e) => set("message", e.target.value)} className={`${inputCls("message")} resize-none border rounded-none`} placeholder="What does your dream wedding look like? What's most important to you?" />
      </InputWrapper>
    </div>
    {/* Summary preview */}
    <div className="border-t border-border/40 pt-6">
      <p className="font-overline text-brand-text-tertiary mb-3">Quick Summary</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-sans-wedding text-sm text-brand-text-secondary font-light">
        <span className="text-brand-text-tertiary">Name</span>
        <span className="text-foreground">{formData.name || "—"}</span>
        <span className="text-brand-text-tertiary">Email</span>
        <span className="text-foreground">{formData.email || "—"}</span>
        {formData.date && (<><span className="text-brand-text-tertiary">Date</span><span className="text-foreground">{formData.date}</span></>)}
        {formData.service && (<><span className="text-brand-text-tertiary">Service</span><span className="text-foreground">{formData.service}</span></>)}
        {formData.guests && (<><span className="text-brand-text-tertiary">Guests</span><span className="text-foreground">{formData.guests}</span></>)}
      </div>
    </div>
  </div>,
];

export { buildSteps, guestRanges, serviceOptions, PillSelect, InputWrapper };
export type { InquiryForm };
