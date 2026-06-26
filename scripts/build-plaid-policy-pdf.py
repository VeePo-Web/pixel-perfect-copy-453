"""Build the Plaid Operations Policy PDF from the markdown source.

Writes:
  - /mnt/documents/goldfin-plaid-operations-policy.pdf   (chat artifact)
  - public/downloads/goldfin-plaid-operations-policy.pdf (web download)
"""
from __future__ import annotations
import os, re, shutil
from pathlib import Path
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)

SRC = Path("docs/plaid/plaid-operations-policy.md")
OUT_DOCS = Path("/mnt/documents/goldfin-plaid-operations-policy.pdf")
OUT_PUBLIC = Path("public/downloads/goldfin-plaid-operations-policy.pdf")
OUT_DOCS.parent.mkdir(parents=True, exist_ok=True)
OUT_PUBLIC.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#0B1F3A")
INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#555555")
RULE = colors.HexColor("#D9D2BF")
GOLD = colors.HexColor("#B89A4E")

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontName="Helvetica-Bold",
                    fontSize=22, leading=26, textColor=NAVY, spaceAfter=8)
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName="Helvetica-Bold",
                    fontSize=14, leading=18, textColor=NAVY, spaceBefore=16, spaceAfter=6)
BODY = ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica",
                      fontSize=10.5, leading=15, textColor=INK, spaceAfter=6)
META = ParagraphStyle("Meta", parent=BODY, fontSize=9, textColor=MUTED)
MONO = ParagraphStyle("Mono", parent=BODY, fontName="Courier", fontSize=8.5, leading=11)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=14, bulletIndent=2, spaceAfter=2)

def inline(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+?)`", r'<font name="Courier" size="9.5">\1</font>', text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
                  r'<link href="\2" color="#0B1F3A"><u>\1</u></link>', text)
    return text

def make_table(rows: list[list[str]]):
    data = [[Paragraph(inline(c), BODY) for c in r] for r in rows]
    t = Table(data, repeatRows=1, hAlign="LEFT", colWidths=None)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#F5EFE0")),
        ("TEXTCOLOR", (0,0), (-1,0), NAVY),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9.5),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.4, RULE),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    return t

def parse(md: str):
    flow = []
    lines = md.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("# "):
            flow.append(Paragraph(inline(line[2:]), H1)); i += 1
        elif line.startswith("## "):
            flow.append(Paragraph(inline(line[3:]), H2)); i += 1
        elif line.startswith("```"):
            block = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i]); i += 1
            i += 1
            txt = "<br/>".join(l.replace(" ", "&nbsp;").replace("<","&lt;").replace(">","&gt;") for l in block)
            flow.append(Paragraph(txt, MONO))
            flow.append(Spacer(1, 6))
        elif line.startswith("|") and i+1 < len(lines) and re.match(r"^\|[\s\-:|]+\|$", lines[i+1]):
            header = [c.strip() for c in line.strip("|").split("|")]
            i += 2
            rows = [header]
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip("|").split("|")])
                i += 1
            flow.append(make_table(rows))
            flow.append(Spacer(1, 6))
        elif re.match(r"^\s*[-*]\s+", line):
            txt = re.sub(r"^\s*[-*]\s+", "", line)
            flow.append(Paragraph(inline(txt), BULLET, bulletText="•"))
            i += 1
        elif re.match(r"^\s*\d+\.\s+", line):
            txt = re.sub(r"^\s*\d+\.\s+", "", line)
            flow.append(Paragraph(inline(txt), BULLET, bulletText="•"))
            i += 1
        elif line.strip() == "---":
            flow.append(Spacer(1, 4))
            i += 1
        elif line.strip() == "":
            flow.append(Spacer(1, 4)); i += 1
        else:
            # collect paragraph
            buf = [line]
            i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|\s*[-*]\s|\s*\d+\.\s)", lines[i]):
                buf.append(lines[i]); i += 1
            flow.append(Paragraph(inline(" ".join(buf)), BODY))
    return flow

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD); canvas.setLineWidth(0.7)
    canvas.line(0.75*inch, LETTER[1]-0.6*inch, LETTER[0]-0.75*inch, LETTER[1]-0.6*inch)
    canvas.setFont("Helvetica", 8.5); canvas.setFillColor(MUTED)
    canvas.drawString(0.75*inch, LETTER[1]-0.45*inch, "GoldFin Desk · Plaid Integration Operations & Maturity Policy")
    canvas.drawRightString(LETTER[0]-0.75*inch, LETTER[1]-0.45*inch, "v2026-06-26.1")
    canvas.drawCentredString(LETTER[0]/2, 0.45*inch, f"Page {doc.page}  ·  goldfindesk.com/plaid-operations")
    canvas.restoreState()

def build(out: Path):
    doc = SimpleDocTemplate(str(out), pagesize=LETTER,
                            leftMargin=0.85*inch, rightMargin=0.85*inch,
                            topMargin=0.95*inch, bottomMargin=0.75*inch,
                            title="GoldFin Desk — Plaid Operations Policy",
                            author="GoldFin Desk")
    md = SRC.read_text(encoding="utf-8")
    doc.build(parse(md), onFirstPage=header_footer, onLaterPages=header_footer)

build(OUT_DOCS)
shutil.copyfile(OUT_DOCS, OUT_PUBLIC)
print(f"wrote {OUT_DOCS} ({OUT_DOCS.stat().st_size} bytes)")
print(f"wrote {OUT_PUBLIC} ({OUT_PUBLIC.stat().st_size} bytes)")
