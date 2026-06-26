// Generates the social share image (Open Graph / Twitter card) at the size
// platforms actually render: 1200x630 PNG. SVG og:images do NOT render in
// Facebook / LinkedIn / X / iMessage / Slack previews — so a shared GoldFin
// link showed no image. This produces a real raster, on-brand.
//
// Run with:  npm i sharp --no-save && node scripts/og-card.mjs
// Output:    public/img/og-card.png  (+ og-card.svg source)
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="20%" cy="16%" r="90%">
      <stop offset="0%" stop-color="#1b1d27"/>
      <stop offset="55%" stop-color="#0B0D12"/>
      <stop offset="100%" stop-color="#070810"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="40" y="40" width="1120" height="550" rx="22" fill="none" stroke="#C9A24A" stroke-opacity="0.18" stroke-width="2"/>

  <!-- GoldFin mark (from public/img/goldfin-logo.svg), scaled ~3.4x -->
  <g transform="translate(142,150) scale(3.4)">
    <path d="M16 60 C 30 44 46 24 57 11 C 60 30 59 48 51 60 Z" fill="#C9A24A"/>
    <path d="M22 53 L32 44 L38 49 L46 35 L51 38 L58 27" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58 27 L50 26 M58 27 L59 35" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <text x="368" y="292" font-family="Georgia, 'Times New Roman', serif" font-size="94" letter-spacing="1" fill="#FFFFFF">GoldFin <tspan fill="#C9A24A">Desk</tspan></text>

  <text x="146" y="432" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#E9E4D6">Your bank activity, turned into a plain-English</text>
  <text x="146" y="484" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#E9E4D6">monthly briefing &#8212; without hiring a CFO.</text>

  <text x="146" y="556" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="2" fill="#C9A24A">goldfindesk.com</text>
</svg>`;

writeFileSync("public/img/og-card.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/img/og-card.png");
console.log("wrote public/img/og-card.png + og-card.svg");
