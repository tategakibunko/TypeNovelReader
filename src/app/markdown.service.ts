import { Injectable } from '@angular/core';
import { Renderer, Marked } from 'marked-ts';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private renderer: Renderer = new Renderer;

  constructor() {
    this.renderer.code = (code: string, exinfo?: string, escaped?: boolean): string => {
      const info = exinfo ? exinfo.split("#") : [];
      const id = info[1] || "";
      const lang = info[0] || "";
      const preOpen = id ? `<pre id="${id}">` : "<pre>";
      const codeOpen = lang ? `<code class="lang-${lang}">` : "<code>";
      return `${preOpen}${codeOpen}${code}</code></pre>`;
    }
    Marked.setOptions({ renderer: this.renderer });
  }

  compile(src: string): string {
    const markedOutput = Marked.parse(src);
    // console.log("marked:%s", markedOutput);
    return markedOutput;
  }
}
