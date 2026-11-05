import { describe, expect, it } from 'vitest';
import { highlight, MathError, renderMarkdown } from '../scripts/lib/render.ts';

const count = (html: string, needle: string) => html.split(needle).length - 1;

describe('renderMarkdown: math', () => {
  it('renders inline and block math with KaTeX', () => {
    const html = renderMarkdown('Sea $z=a+bi$.\n\n$$\n\\sum_{n=1}^\\infty \\frac{1}{n^2}\n$$\n');
    expect(count(html, 'class="katex"')).toBe(2);
    expect(html).toContain('class="math-block"');
    expect(html).toContain('katex-display');
  });
  it('does not let Markdown eat underscores or asterisks inside math', () => {
    const html = renderMarkdown('$a_1 * b_2$ y $x_i^2$');
    expect(html).not.toContain('<em>');
    expect(count(html, 'class="katex"')).toBe(2);
  });
  it('keeps escaped dollars as text', () => {
    const html = renderMarkdown('Cuesta \\$5 y \\$7.');
    expect(html).not.toContain('katex');
    expect(html).toContain('$5');
  });
  it('ignores dollars inside inline code and code blocks', () => {
    const html = renderMarkdown('Usa `echo $HOME` así:\n\n```bash\necho $PATH $HOME\n```\n');
    expect(html).not.toContain('katex');
    expect(html).toContain('$HOME');
  });
  it('does not treat a price-like "$ 5" (space after $) as math', () => {
    expect(renderMarkdown('Entre $ 5 y 6 $ no hay fórmula')).not.toContain('katex');
  });
  it('supports $$...$$ inline inside a paragraph (display mode)', () => {
    const html = renderMarkdown('Mira: $$x^2$$ en línea.');
    expect(html).toContain('katex-display');
  });
  it('provides the course macros \\R \\N \\Z \\Q \\C', () => {
    const html = renderMarkdown('$\\R\\N\\Z\\Q\\C$');
    expect(html).not.toContain('math-error');
    expect(html).toContain('mathbb');
    expect(html.replace(/<[^>]+>/g, '')).toContain('RNZQC');
  });
  it('marks broken LaTeX in red when not strict, and throws MathError when strict', () => {
    expect(renderMarkdown('mal: $\\frac{1}{$ fin')).toContain('math-error');
    expect(() => renderMarkdown('mal: $\\frac{1}{$ fin', { strict: true })).toThrow(MathError);
  });
  it('handles matrices with & and \\\\ in block math', () => {
    const html = renderMarkdown('$$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$$');
    expect(html).not.toContain('math-error');
    expect(html).toContain('katex-display');
  });
});

describe('renderMarkdown: code and tables', () => {
  it('highlights C++ blocks', () => {
    const html = renderMarkdown('```cpp\nint main() { return 0; }\n```');
    expect(html).toContain('class="hljs language-cpp"');
    expect(html).toContain('hljs-type');
  });
  it('maps aliases and falls back to escaped plain text', () => {
    expect(highlight('x', 'c++').lang).toBe('cpp');
    const plain = highlight('a < b && c', 'pseudocodigo');
    expect(plain.lang).toBe('plaintext');
    expect(plain.html).toBe('a &lt; b &amp;&amp; c');
  });
  it('wraps tables in a horizontal scroller', () => {
    const html = renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |\n');
    expect(html).toContain('<div class="table-wrap"><table>');
    expect(html).toContain('</table></div>');
  });
});
