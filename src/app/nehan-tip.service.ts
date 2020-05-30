import { Injectable } from '@angular/core';
import { InfoDialogData } from '../../common/models';
import * as Nehan from 'nehan';

interface TipArgs {
  fontFamily: string;
  color?: string;
  onClick: (event: Event, tip: InfoDialogData) => void;
}

@Injectable({
  providedIn: 'root'
})
export class NehanTipService {
  private tipId = 1;
  private tips: { [tipId: string]: InfoDialogData } = {};
  private defaultColor = '#ea4c88';

  constructor() { }

  private genId(): string {
    return (this.tipId++).toString();
  }

  private reset() {
    this.tipId = 1;
    this.tips = {};
  }

  preCompile(html: string): string {
    this.reset();
    return html.replace(/<tip data-title="(.*?)">([\s|\S]*?)<\/tip>/gi, (_, title, innerHTML) => {
      const tipId = this.genId();
      this.tips[tipId] = { title, innerHTML };
      return `<span class="tip" data-id="${tipId}"><icon class="attach"></icon>${title}</span>`;
    });
  }

  create(args: TipArgs): Nehan.CssStyleSheet {
    const fontFamily = args.fontFamily || 'inherit';
    const color = args.color || this.defaultColor;
    return new Nehan.CssStyleSheet({
      '.tip': {
        display: 'inline',
        fontWeight: 'bold',
        fontFamily,
        color,
        '@create': (ctx: Nehan.DomCallbackContext) => {
          ctx.dom.addEventListener('click', (e: Event) => {
            const tid = ctx.box.env.element.dataset.id;
            const tip = this.tips[tid] || { title: 'no title', content: 'no content' };
            args.onClick(e, tip);
          });
        }
      }
    });
  }
}
