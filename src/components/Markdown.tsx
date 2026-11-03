import { marked } from 'marked';
import { useMemo } from 'react';

/** Solo para contenido propio de las lecciones (no para texto de usuarios). */
export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => marked.parse(text, { async: false }) as string, [text]);
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}
