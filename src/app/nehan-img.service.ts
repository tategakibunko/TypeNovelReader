import { Injectable } from '@angular/core';
import * as path from 'path';
import * as Nehan from 'nehan';

interface ImgStyleArgs {
  basePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class NehanImgService {
  constructor() { }

  create(args: ImgStyleArgs): Nehan.CssStyleSheet {
    return new Nehan.CssStyleSheet({
      img: {
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const src = ctx.box.element.getAttribute('src');
          // if not remote image, set local absolute path.
          if (!src.toLowerCase().startsWith('http')) {
            const resPath = path.join(args.basePath, src);
            ctx.dom.setAttribute('src', resPath);
          }
        }
      }
    });
  }
}
