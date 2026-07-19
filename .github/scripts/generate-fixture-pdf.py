#!/usr/bin/env python3

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


OUTPUT = Path(
    "exampleSite/content/fixtures/artefact-pdf-download/field-card.pdf"
)


def draw_field(label, value, x, y, width):
    ink = HexColor("#171512")
    paper = HexColor("#F3EDDB")
    signal = HexColor("#D92D20")

    page.setFillColor(signal)
    page.rect(x, y - 17, 86, 17, fill=1, stroke=0)
    page.setFillColor(paper)
    page.setFont("Helvetica-Bold", 7)
    page.drawString(x + 6, y - 12, label.upper())
    page.setStrokeColor(ink)
    page.line(x, y - 21, x + width, y - 21)
    page.setFillColor(ink)
    page.setFont("Helvetica", 10)
    page.drawString(x + 98, y - 13, value)


OUTPUT.parent.mkdir(parents=True, exist_ok=True)

page = canvas.Canvas(
    str(OUTPUT),
    pagesize=A4,
    invariant=1,
    pageCompression=1,
)
page.setTitle("Field Card for an Unreasonably Specific Drawer")
page.setAuthor("The Night Shift Committee")
page.setSubject("A fictional No Fate artefact fixture")
page.setCreator("No Fate fixture generator")

width, height = A4
ink = HexColor("#171512")
paper = HexColor("#F3EDDB")
signal = HexColor("#D92D20")

page.setFillColor(paper)
page.rect(0, 0, width, height, fill=1, stroke=0)
page.setStrokeColor(ink)
page.setLineWidth(4)
page.rect(30, 30, width - 60, height - 60, fill=0, stroke=1)

page.setFillColor(signal)
page.rect(30, height - 210, width - 60, 180, fill=1, stroke=0)
page.setFillColor(paper)
page.setFont("Helvetica-Bold", 13)
page.drawString(52, height - 67, "NORTH QUAY / DRAWER RECORD")
page.setFont("Helvetica-Bold", 38)
page.drawString(52, height - 122, "FIELD CARD")
page.setFont("Helvetica-Bold", 24)
page.drawString(52, height - 160, "FOR AN UNREASONABLY")
page.drawString(52, height - 189, "SPECIFIC DRAWER")

page.setFillColor(ink)
page.setFont("Helvetica-Bold", 66)
page.drawRightString(width - 50, height - 89, "Q-17")

draw_field("Object", "One brass handle without an agreed door", 52, 585, 490)
draw_field("Location", "Cupboard beside the kettle, third drawer", 52, 535, 490)
draw_field("Date", "12 March 1984, approximately 14:20", 52, 485, 490)
draw_field("Recorded by", "The Night Shift Committee", 52, 435, 490)
draw_field("Condition", "Polished by handling; purpose remains speculative", 52, 385, 490)

page.setFillColor(ink)
page.setFont("Helvetica-Bold", 10)
page.drawString(52, 322, "HANDLING INSTRUCTIONS")
page.setFont("Helvetica", 12)
instructions = [
    "1. Open the drawer as though it has already objected.",
    "2. Do not separate the handle from its unreasonable specificity.",
    "3. Return before tea, or leave a note with a convincing diagram.",
]
for index, line in enumerate(instructions):
    page.drawString(52, 298 - (index * 24), line)

page.setStrokeColor(signal)
page.setLineWidth(8)
page.line(52, 200, width - 52, 200)
page.setFillColor(ink)
page.setFont("Helvetica-Bold", 17)
page.drawString(52, 168, "SIGNIFICANCE")
page.setFont("Helvetica", 11)
page.drawString(
    52,
    145,
    "Proof that a filing system may be exact, useful and faintly ridiculous.",
)

page.setFont("Helvetica-Bold", 8)
page.drawString(52, 69, "FICTIONAL DEMONSTRATION ARTEFACT")
page.drawRightString(width - 52, 69, "NO FATE / PAGE 1 OF 1")

page.showPage()
page.save()
print(f"Wrote {OUTPUT}")
