import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  transform(preMarkdownString: any): string {
    if (!preMarkdownString)
      return '';

    // Parsing MarkDown
    return marked.parse(preMarkdownString, { async: false });
  }
}
