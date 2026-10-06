// lib/blog/sanitize.ts
// Every post body is sanitized on save, whoever (or whatever) wrote it, so a
// leaked admin password or a bad AI output can't inject scripts into the
// public site. The allow-list covers everything the existing posts use.

import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "code", "pre", "span",
    "ul", "ol", "li", "blockquote",
    "a",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "div", "section",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title", "class", "style"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
    "*": ["style"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    // <h1> belongs to the page template; demote any in the body.
    h1: "h2",
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?lkdigital\.odo\.br/i.test(href);
      return {
        tagName,
        attribs: external || attribs.target === "_blank"
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : attribs,
      };
    },
  },
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS).trim();
}

/** Plain-text fields (titles, excerpts, FAQ): strip any markup entirely. */
export function plainText(s: string): string {
  return sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}
