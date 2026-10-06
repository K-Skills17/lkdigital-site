// PostCSS plugin: scopes the stylesheets of the free tools under src/tools/<slug>/
// to a `.tool-<slug>` wrapper so each tool keeps its original look without its
// global rules (`*`, `body`, `.container`, `@keyframes fadeUp`…) leaking into
// the rest of the site — Next.js keeps CSS loaded across client navigations.

const path = require("path");

const TOOL_DIR = `${path.sep}src${path.sep}tools${path.sep}`;

function slugFor(file) {
  if (!file) return null;
  const i = file.indexOf(TOOL_DIR);
  if (i === -1) return null;
  const slug = file.slice(i + TOOL_DIR.length).split(path.sep)[0];
  return slug && slug !== "shared" ? slug : null;
}

function scopeSelector(sel, scope) {
  const s = sel.trim();
  if (/^(:root|html|body)$/.test(s)) return scope;
  if (/^(:root|html|body)\s+/.test(s)) return s.replace(/^(:root|html|body)/, scope);
  if (s === "*") return `${scope}, ${scope} *`;
  if (s.startsWith("*::")) return `${scope}${s.slice(1)}, ${scope} ${s}`;
  return `${scope} ${s}`;
}

const KEYFRAMES = /^(-webkit-)?keyframes$/;

module.exports = () => ({
  postcssPlugin: "postcss-tool-scope",
  prepare(result) {
    const slug = slugFor(result.root.source && result.root.source.input.file);
    if (!slug) return {};
    const scope = `.tool-${slug}`;
    const renamed = new Map();

    return {
      Once(root) {
        root.walkAtRules(KEYFRAMES, (at) => {
          const name = at.params.trim();
          if (!renamed.has(name)) renamed.set(name, `${name}--${slug}`);
          at.params = renamed.get(name);
        });
        root.walkDecls(/^(-webkit-)?animation(-name)?$/, (decl) => {
          decl.value = decl.value
            .split(",")
            .map((part) =>
              part.replace(/[A-Za-z_][\w-]*/g, (tok) => renamed.get(tok) || tok)
            )
            .join(",");
        });
        root.walkRules((rule) => {
          if (rule.parent && rule.parent.type === "atrule" && KEYFRAMES.test(rule.parent.name)) return;
          if (rule.selector.includes(scope)) return;
          rule.selectors = rule.selectors.map((sel) => scopeSelector(sel, scope));
        });
      },
    };
  },
});
module.exports.postcss = true;
