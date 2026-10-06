"use client";

// Rich-text editor for blog posts: a visual mode (TipTap) and a raw HTML mode.
// Posts that use markup the visual editor can't represent (custom <div>/<section>
// blocks, inline styles) open in HTML mode so nothing is silently stripped.

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";

/** Markup the visual editor would drop. */
export function unsupportedMarkup(html: string): string[] {
  const found = new Set<string>();
  const re = /<(div|section|span|h4|pre)[\s>]/gi;
  for (let m = re.exec(html); m; m = re.exec(html)) found.add(`<${m[1].toLowerCase()}>`);
  if (/\sstyle\s*=/i.test(html)) found.add("estilos inline (style=)");
  if (/\sclass\s*=/i.test(html)) found.add("classes (class=)");
  return Array.from(found);
}

const CONTENT_CLASSES =
  "prose-content min-h-[420px] px-4 py-3 focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-foreground [&_h3]:mb-2 [&_h3]:mt-5 [&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:text-[15px] [&_li]:mb-1 [&_table]:w-full [&_table]:mb-4 [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-muted [&_th]:border [&_th]:border-border [&_td]:p-2 [&_td]:border [&_td]:border-border [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-accent [&_a]:underline [&_strong]:text-foreground";

function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`h-8 min-w-8 px-2 rounded text-sm transition-colors disabled:opacity-30 ${
        active ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link (ex.: /blog/outro-artigo ou https://…). Vazio remove o link.", prev ?? "");
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const inTable = editor.isActive("table");
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-card sticky top-0 z-10">
      <Btn title="Subtítulo (H2)" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn title="Subtítulo menor (H3)" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Btn title="Parágrafo" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>¶</Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>🔗</Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Lista</Btn>
      <Btn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Lista</Btn>
      <Btn title="Citação" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Inserir tabela" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Tabela</Btn>
      {inTable && (
        <>
          <Btn title="Adicionar linha" onClick={() => editor.chain().focus().addRowAfter().run()}>+ linha</Btn>
          <Btn title="Adicionar coluna" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ coluna</Btn>
          <Btn title="Remover linha" onClick={() => editor.chain().focus().deleteRow().run()}>− linha</Btn>
          <Btn title="Remover coluna" onClick={() => editor.chain().focus().deleteColumn().run()}>− coluna</Btn>
          <Btn title="Remover tabela" onClick={() => editor.chain().focus().deleteTable().run()}>✕ tabela</Btn>
        </>
      )}
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Desfazer" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</Btn>
      <Btn title="Refazer" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</Btn>
    </div>
  );
}

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const initialUnsupported = useMemo(() => unsupportedMarkup(value), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [mode, setMode] = useState<"visual" | "html">(initialUnsupported.length ? "html" : "visual");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } },
      }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: mode === "visual" ? value : "",
    immediatelyRender: false,
    editorProps: { attributes: { class: CONTENT_CLASSES, "aria-label": "Conteúdo do artigo" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the visual editor in sync when the value is replaced from outside
  // (restoring a version, switching from HTML mode).
  useEffect(() => {
    if (!editor || mode !== "visual") return;
    if (editor.getHTML() !== value) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value, mode]);

  const switchTo = (next: "visual" | "html") => {
    if (next === mode) return;
    if (next === "visual") {
      const lost = unsupportedMarkup(value);
      if (lost.length && !window.confirm(`O editor visual vai remover: ${lost.join(", ")}. Continuar?`)) return;
    }
    setMode(next);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-xs">
        <span className="text-muted-foreground">Conteúdo</span>
        <div className="inline-flex rounded border border-border overflow-hidden" role="tablist">
          {(["visual", "html"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchTo(m)}
              className={`px-3 py-1 ${mode === m ? "bg-foreground text-background" : "hover:bg-muted"}`}
            >
              {m === "visual" ? "Visual" : "HTML"}
            </button>
          ))}
        </div>
      </div>

      {mode === "html" && initialUnsupported.length > 0 && (
        <p className="px-3 py-2 text-xs bg-amber-50 text-amber-900 border-b border-amber-200">
          Este artigo usa {initialUnsupported.join(", ")}, que o editor visual removeria — por isso abriu em HTML.
        </p>
      )}

      {mode === "visual" ? (
        editor ? (
          <>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="min-h-[420px]" />
        )
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label="Conteúdo do artigo em HTML"
          className="block w-full min-h-[520px] p-3 font-mono text-xs leading-relaxed bg-card text-foreground focus:outline-none"
        />
      )}
    </div>
  );
}
