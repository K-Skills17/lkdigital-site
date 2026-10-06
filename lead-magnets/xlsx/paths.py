"""Paths shared by the spreadsheet builders and their tests (lead-magnets/ inside the site repo)."""
from pathlib import Path

LM = Path(__file__).resolve().parent.parent      # lead-magnets/
SITE = LM.parent                                  # repo root
DEMO_JSON = SITE / "src" / "tools" / "shared" / "demo-clinic.json"
OUT = SITE / "public" / "ferramentas" / "arquivos"
