import { describe, expect, it } from "vitest";
import postcss from "postcss";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const scope = require("./postcss-tool-scope.cjs");

const run = (css: string, file: string) => postcss([scope()]).process(css, { from: file }).css;
const toolFile = path.join(__dirname, "src", "tools", "calculadora-agenda", "index.css");

describe("postcss-tool-scope", () => {
  it("scopes globals and class rules to the tool wrapper", () => {
    const out = run(":root{--accent:red} body{margin:0} *{box-sizing:border-box} .btn,h1{color:red} @media (max-width:600px){.btn{color:blue}}", toolFile);
    expect(out).toContain(".tool-calculadora-agenda{--accent:red}");
    expect(out).toContain(".tool-calculadora-agenda{margin:0}");
    expect(out).toContain(".tool-calculadora-agenda, .tool-calculadora-agenda *{box-sizing:border-box}");
    expect(out).toContain(".tool-calculadora-agenda .btn,.tool-calculadora-agenda h1{color:red}");
    expect(out).toContain("@media (max-width:600px){.tool-calculadora-agenda .btn{color:blue}}");
  });

  it("renames keyframes so they can't clobber the site's (e.g. Tailwind fadeUp)", () => {
    const out = run("@keyframes fadeUp{from{opacity:0}to{opacity:1}} .a{animation:fadeUp .5s ease-out forwards}", toolFile);
    expect(out).toContain("@keyframes fadeUp--calculadora-agenda{from{opacity:0}to{opacity:1}}");
    expect(out).toContain("animation:fadeUp--calculadora-agenda .5s ease-out forwards");
  });

  it("leaves CSS outside src/tools untouched", () => {
    const css = "body{margin:0} @keyframes fadeUp{to{opacity:1}}";
    expect(run(css, path.join(__dirname, "src", "app", "globals.css"))).toBe(css);
  });
});
