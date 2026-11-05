// Markdown -> HTML at build time, with KaTeX math and highlight.js code blocks.
// Rendering happens in Node so the app ships only HTML + KaTeX CSS/fonts.

import { Marked, type TokenizerAndRendererExtension, type Tokens } from 'marked';
import katex from 'katex';
import hljs from 'highlight.js';

export const KATEX_MACROS: Record<string, string> = {
  '\\R': '\\mathbb{R}',
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\C': '\\mathbb{C}',
  '\\K': '\\mathbb{K}',
};

export interface RenderOptions {
  /** Throw on LaTeX errors (used by the validator). Default false: render the error in red. */
  strict?: boolean;
}

export class MathError extends Error {
  readonly tex: string;
  constructor(tex: string, message: string) {
    super(message);
    this.tex = tex;
  }
}

function renderMath(tex: string, displayMode: boolean, strict: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: true,
      output: 'html',
      macros: { ...KATEX_MACROS },
      strict: 'ignore',
    });
  } catch (e) {
    if (strict) throw new MathError(tex, (e as Error).message);
    const safe = tex.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<code class="math-error" title="Error de LaTeX">${safe}</code>`;
  }
}

/** Index of the first `$` that is not escaped with a backslash. */
function firstDollar(src: string): number | undefined {
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '\\') {
      i++;
      continue;
    }
    if (src[i] === '$') return i;
  }
  return undefined;
}

function mathExtensions(strict: boolean): TokenizerAndRendererExtension[] {
  return [
    {
      name: 'blockMath',
      level: 'block',
      start(src: string) {
        const i = src.indexOf('$$');
        return i < 0 ? undefined : i;
      },
      tokenizer(src: string) {
        const m = /^\$\$([\s\S]+?)\$\$[ \t]*(?:\n+|$)/.exec(src);
        if (m) return { type: 'blockMath', raw: m[0], text: m[1].trim() };
        return undefined;
      },
      renderer(token: Tokens.Generic) {
        return `<div class="math-block">${renderMath(token.text, true, strict)}</div>\n`;
      },
    },
    {
      name: 'inlineMath',
      level: 'inline',
      start: firstDollar,
      tokenizer(src: string) {
        let m = /^\$\$([\s\S]+?)\$\$/.exec(src);
        if (m) return { type: 'inlineMath', raw: m[0], text: m[1].trim(), display: true };
        m = /^\$(?!\s)((?:\\.|[^\\$\n])+?)\$(?!\d)/.exec(src);
        if (m) return { type: 'inlineMath', raw: m[0], text: m[1], display: false };
        return undefined;
      },
      renderer(token: Tokens.Generic) {
        return renderMath(token.text, Boolean(token.display), strict);
      },
    },
  ];
}

const LANG_ALIASES: Record<string, string> = { 'c++': 'cpp', cc: 'cpp', hpp: 'cpp', h: 'cpp', py: 'python', js: 'javascript', ts: 'typescript', sh: 'bash', shell: 'bash', pseudocodigo: 'plaintext', pseudo: 'plaintext', text: 'plaintext', txt: 'plaintext' };

export function highlight(code: string, lang?: string): { html: string; lang: string } {
  const l = (lang ?? '').trim().split(/\s+/)[0].toLowerCase();
  const name = LANG_ALIASES[l] ?? l;
  if (name && name !== 'plaintext' && hljs.getLanguage(name)) {
    return { html: hljs.highlight(code, { language: name, ignoreIllegals: true }).value, lang: name };
  }
  const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return { html: esc, lang: name || 'plaintext' };
}

function createMarked(strict: boolean): Marked {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    extensions: mathExtensions(strict),
    renderer: {
      code({ text, lang }: Tokens.Code) {
        const h = highlight(text, lang);
        return `<pre class="code"><code class="hljs language-${h.lang}">${h.html}</code></pre>\n`;
      },
    },
    hooks: {
      postprocess(html: string) {
        return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
      },
    },
  });
  return marked;
}

const cache = new Map<boolean, Marked>();

export function renderMarkdown(md: string, opts: RenderOptions = {}): string {
  const strict = Boolean(opts.strict);
  let m = cache.get(strict);
  if (!m) {
    m = createMarked(strict);
    cache.set(strict, m);
  }
  return m.parse(md, { async: false }) as string;
}
