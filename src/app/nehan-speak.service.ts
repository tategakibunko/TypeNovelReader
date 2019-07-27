import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';

interface SpeechArgs {
  getTooltip: (charaId: string) => string;
  onClick: (event: Event, charaId: string) => void;
}

@Injectable({
  providedIn: 'root'
})
export class NehanSpeakService {
  constructor() { }

  create(args: SpeechArgs): Nehan.CssStyleSheet {
    return new Nehan.CssStyleSheet({
      'div.speak': {
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const a = document.createElement('a');
          const icon = document.createElement('i');
          const fontSize = ctx.box.env.fontSize;
          new Nehan.LogicalPos({
            start: -Math.floor(fontSize * 1.5),
            before: Math.floor(fontSize * 0.125)
          }).getCss(ctx.box).apply(a);
          icon.className = 'user outline icon';
          a.style.position = 'absolute';
          a.style.display = 'block';
          a.appendChild(icon);
          ctx.dom.appendChild(a);
          const charaKey = ctx.box.element.dataset.character;
          if (charaKey) {
            a.dataset.tooltip = args.getTooltip(charaKey);
            icon.addEventListener('click', (e) => {
              args.onClick(e, charaKey);
            });
          }
        }
      }
    });
  }
}
