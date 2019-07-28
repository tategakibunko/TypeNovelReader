import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NehanRubyService {
  constructor() { }

  preCompile(html: string): string {
    html = html.replace(
      /([\u2E80-\u2FDF\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u20000-\u2FFFF]+)《(.+?)》/g,
      '<ruby>$1<rt>$2</rt></ruby>'
    );
    html = html.replace(/<ruby-text data-rb='(.*?)' data-rt='(.*?)'><\/ruby-text>/gi, (_, rb, rt) => {
      // [TODO] supports multi rb, multi rt
      return `<ruby>${rb}<rt>${rt}</rt></ruby>`;
    });
    return html;
  }
}
