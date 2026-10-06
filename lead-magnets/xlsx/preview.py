"""Renders the landing-page screenshot of the demo Dashboard tab.

    python3 lead-magnets/xlsx/preview.py   (after build_dashboard.py)

Exports the demo workbook to PDF with LibreOffice, rasterizes the Dashboard page and
crops the top (KPI row, indicators, trend charts) into public/ferramentas/arquivos/
dashboard-preview.jpg, the screenshot on /ferramentas/dashboard-clinica.
"""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paths import OUT as FILES, SITE  # noqa: E402

SRC = FILES / "dashboard-clinica-demo.xlsx"
OUT = FILES / "dashboard-preview.jpg"


def main():
    with tempfile.TemporaryDirectory(prefix="dash-preview-") as tmp:
        tmp = Path(tmp)
        env = {**os.environ, "SAL_USE_VCLPLUGIN": "svp"}
        # Render with Brazilian number formatting (R$ 46.750,00), as Excel/Sheets show it in pt-BR.
        user = tmp / "p" / "user"
        user.mkdir(parents=True)
        (user / "registrymodifications.xcu").write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" '
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n'
            '<item oor:path="/org.openoffice.Setup/L10N"><prop oor:name="ooSetupSystemLocale" oor:op="fuse"><value>pt-BR</value></prop></item>\n'
            '</oor:items>\n', encoding="utf-8")
        subprocess.run(["soffice", f"-env:UserInstallation={(tmp / 'p').as_uri()}", "--headless",
                        "--convert-to", "pdf", "--outdir", str(tmp), str(SRC)],
                       check=True, capture_output=True, timeout=180, env=env)
        pdf = tmp / (SRC.stem + ".pdf")
        # Find the Dashboard page by its title.
        pages = int(next(l.split()[-1] for l in subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout.splitlines() if l.startswith("Pages")))
        page = next(p for p in range(1, pages + 1)
                    if "Dashboard da clínica\n" in subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), str(pdf), "-"], capture_output=True, text=True).stdout)
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", "200", "-png", str(pdf), str(tmp / "pg")], check=True)
        png = next(tmp.glob("pg*.png"))
        # Keep the top-left block (KPI row + colored indicators): readable on a phone.
        subprocess.run(["convert", str(png), "-gravity", "NorthWest", "-crop", "43.6%x40%+0+0", "+repage",
                        "-trim", "+repage", "-bordercolor", "white", "-border", "24",
                        "-resize", "1000x>", "-strip", "-quality", "78", str(OUT)], check=True)
    print(f"{OUT.relative_to(SITE)}  {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    sys.exit(main())
