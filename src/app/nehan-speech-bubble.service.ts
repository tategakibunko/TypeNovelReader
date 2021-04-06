import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NehanSpeechBubbleService {

  constructor() { }

  preCompile(html: string): string {
    return html.replace(
      /<speech-bubble data-direction="(.*?)" data-chara-key="(.*?)" data-image-key="(.*?)">([\s|\S]*?)<\/speech-bubble>/g,
      (_, direction, charaKey, imageKey, content) => {
        const tdName = `<td class="name" data-chara-key="${charaKey}" data-image-key="${imageKey}">`;
        const tdText = [
          `<td class="text"><div class="speech-bubble ${direction}">`,
          `<div class="content" data-chara-key="${charaKey}">${content}</div>`,
          '</div></td>'
        ].join('');
        const tds = direction === 'start' ? [tdName, tdText] : [tdText, tdName];
        const tr = tds.join('');
        return `<table class="sb-table"><tbody><tr>${tr}</tr></tbody></table>`;
      });
  }
}
