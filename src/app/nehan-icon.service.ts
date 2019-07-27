import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';

@Injectable({
  providedIn: 'root'
})
export class NehanIconService {
  constructor() { }

  create(): Nehan.CssStyleSheet {
    return new Nehan.CssStyleSheet({
      icon: {
        display: 'inline-block',
        lineHeight: '1',
        extent: '1em',
        measure: '1em',
        marginEnd: '0.18em',
        fontSize: '1em',
        content: ' ',
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const i = document.createElement('i');
          const iconName = ctx.box.element.className;
          i.className = ['ui', 'icon', iconName].join(' ');
          i.style.width = '1em';
          i.style.margin = '0';
          ctx.dom.appendChild(i);
          ctx.box.clearChildren();
        }
      }
    });
  }
}
