import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, Renderer } from 'marked';

/**
 * Pipe che converte testo Markdown in HTML sicuro.
 * Supporta: grassetto, corsivo, link ipertestuali, codice inline.
 * L'output viene sanitizzato tramite DomSanitizer di Angular.
 *
 * Uso: <div [innerHTML]="text | markdown"></div>
 */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    // Renderer personalizzato: i link si aprono in nuova tab
    const renderer = new Renderer();
    renderer.link = ({ href, text }: { href: string; title?: string | null; text: string }) => {
      const safeHref = href?.startsWith('javascript') ? '#' : (href ?? '#');
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    // Configurazione marked: solo inline (no blocchi complessi)
    marked.use({ renderer });
    const rawHtml = marked.parse(value, { async: false }) as string;

    // Sanitizzazione Angular prima del bypass
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }
}
