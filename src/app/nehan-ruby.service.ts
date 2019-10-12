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
    // <ruby-text data-rt='かん,じ'>漢,字</ruby-text>
    // => <ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
    html = html.replace(/<ruby-text data-rt="(.*?)">([\s|\S]*?)<\/ruby-text>/g, (_, rt, rb) => {
      const rbs = rb.split(',').filter((s: string) => s !== '');
      const rts = rt.split(',').filter((s: string) => s !== '');
      const rubyBody = rbs.map((rbText: string, i: number) => {
        return [rbText, rts[i] || ''];
      }).reduce((acm: string, zip: string[]) => {
        const rbText = zip[0].trim();
        const rtText = zip[1].trim();
        return acm + `${rbText}<rt>${rtText}</rt>`;
      }, '');
      return `<ruby>${rubyBody}</ruby>`;
    });
    return html;
  }
}
