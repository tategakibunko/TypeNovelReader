import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';

interface SbTableArgs {
  avatarSize: number;
  labelFontFamily: string;
  getCharacterName: (charaKey: string) => string;
  getCharacterImageSrc: (charaKey: string, imageKey: string) => string;
  onClickCharacter: (event: any, charaKey: string) => void;
}

const defaultStyle = {
  avatarSize: 100,
  labelFontFamily: 'monospace',
  getCharacterName: (charaKey: string) => {
    return charaKey;
  },
  getCharacterImageSrc: (charaKey: string, imageKey: string) => {
    return '';
  },
  onClickCharacter: (event: any, charaKey: string) => {
    alert(charaKey);
  }
};

@Injectable({
  providedIn: 'root'
})
export class NehanSbTableService {
  constructor() { }

  create(args: SbTableArgs): Nehan.CssStyleSheet {
    args = Nehan.Utils.mergeDefault(args, defaultStyle);
    return new Nehan.CssStyleSheet({
      'table.sb-table': {
        borderWidth: '0',
        marginBefore: '1em',
        marginAfter: '1em',
        '!dynamic': Nehan.DynamicStyleUtils.requiredExtent(args.avatarSize + 10)
      },
      '.sb-table tbody': {
        borderWidth: '0'
      },
      '.sb-table tr': {
        borderWidth: '0'
      },
      '.sb-table td': {
        borderWidth: '0'
      },
      '.sb-table td.name': {
        fontFamily: args.labelFontFamily,
        measure: args.avatarSize + 'px',
        '!dynamic': (ctx: Nehan.DynamicStyleContext) => {
          if (ctx.element.querySelector('img')) {
            return {}; // already added
          }
          const charaKey = ctx.element.dataset.charaKey;
          const imageKey = ctx.element.dataset.imageKey || '';
          const imageSrc = args.getCharacterImageSrc(charaKey, imageKey);
          const image = ctx.element.root.createElement('img');
          image.setAttribute('width', String(args.avatarSize));
          image.setAttribute('height', String(args.avatarSize));
          image.setAttribute('src', imageSrc);
          Nehan.CssLoader.load(image);
          ctx.element.appendChild(image);
          return {};
        },
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const charaKey = ctx.box.env.element.dataset.charaKey;
          if (charaKey) {
            const charaName = args.getCharacterName(charaKey);
            ctx.dom.setAttribute('title', charaName);
            ctx.dom.addEventListener('click', (e: Event) => {
              args.onClickCharacter(e, charaKey);
            });
          }
        }
      },
      '.sb-table td.text .content': {
        '!dynamic': (ctx: Nehan.DynamicStyleContext) => {
          if (ctx.element.querySelector('.title')) {
            return {}; // already added
          }
          const charaKey = ctx.element.dataset.charaKey;
          const charaName = args.getCharacterName(charaKey);
          const div = ctx.element.root.createElement('div');
          const family = args.labelFontFamily;
          div.setAttribute('style', `font-weight:bold; font-size:smaller; font-family:${family}`);
          div.classList.add('title');
          div.appendChild(ctx.element.root.createTextNode(charaName));
          ctx.element.insertBefore(div, ctx.element.firstChild);
          return {};
        }
      }
    });
  }
}
