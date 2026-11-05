export interface Route {
  path: string[]; // e.g. ['asignaturas', 'calculo', '01-numeros-complejos']
  query: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '');
  const [p, q = ''] = raw.split('?');
  const path = p.split('/').filter(Boolean).map(decodeURIComponent);
  return { path: path.length ? path : ['hoy'], query: new URLSearchParams(q) };
}

export function href(path: string, query?: Record<string, string | undefined>): string {
  const qs = query ? new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined) as [string, string][]).toString() : '';
  return `#/${path}${qs ? `?${qs}` : ''}`;
}

export function go(path: string, query?: Record<string, string | undefined>): void {
  location.hash = href(path, query);
}
