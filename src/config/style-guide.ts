/**
 * HICKORY & ROSE — Style Guide Reference
 * 
 * This file is a DECISION-MAKING REFERENCE ONLY. It does not render anything.
 * Populated from the Hickory & Rose brand style guide once provided.
 * 
 * STATUS: Awaiting Hickory & Rose style guide document.
 */

export const STYLE_GUIDE = {
  // TODO: Populate from Hickory & Rose style guide
  colors: {
    primary: { hex: "", hsl: "", usage: "" },
    secondary: { hex: "", hsl: "", usage: "" },
    accent: { hex: "", hsl: "", usage: "" },
    neutral: { hex: "", hsl: "", usage: "" },
  },

  typography: {
    headingFont: { name: "", weights: [] as string[], usage: "" },
    bodyFont: { name: "", weights: [] as string[], usage: "" },
    sizeScale: {} as Record<string, string>,
  },

  logo: {
    primary: "", // Path to primary logo
    alternate: "", // Path to alternate logo
    icon: "", // Path to icon/favicon
    clearSpace: "", // Minimum clear space rules
    minSize: "", // Minimum size rules
    doNots: [] as string[], // Logo usage restrictions
  },

  spacing: {
    philosophy: "Generous editorial whitespace — calm through spacing, refined restraint",
    sectionPadding: "",
    componentGap: "",
  },

  imagery: {
    style: ["warm", "true-to-life", "editorial", "polished", "candid documentary", "detail-forward"],
    avoid: ["generic stock photos", "DIY rustic aesthetic", "Pinterest collage", "overly filtered"],
    aspectRatios: {} as Record<string, string>,
  },

  components: {
    buttonStyle: "", // TODO: e.g., "solid with slight radius", "sharp corners"
    cardStyle: "", // TODO: e.g., "subtle shadow", "bordered"
    inputStyle: "", // TODO: e.g., "underline", "bordered"
  },
} as const;
