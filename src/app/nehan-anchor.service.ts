import { Injectable } from '@angular/core';
import {
  Anchor,
  CssStyleSheet,
  DomCallbackContext,
} from 'nehan';

@Injectable({
  providedIn: 'root'
})
export class NehanAnchorService {
  constructor() { }

  public create(args: {
    onClickAnchorLink: (anchor: Anchor) => void,
  }): CssStyleSheet {
    return new CssStyleSheet({
      "a[href^=#]": {
        "@create": (ctx: DomCallbackContext) => {
          const element = ctx.box.env.element;
          const href = element.getAttribute("href");
          const anchorName = href.substring(1);
          const win = document.createElement("div");
          const isVert = ctx.box.env.writingMode.isTextVertical();
          win.style.padding = "1rem";
          win.style.border = "1px solid #dadada";
          win.style.position = "absolute";
          win.style.background = "white";
          win.style.zIndex = "100";
          if (isVert) {
            win.style.left = `${ctx.dom.offsetLeft + ctx.box.extent + 5}px`;
            win.style.top = `${ctx.dom.offsetTop}px`;
          } else {
            win.style.left = `${ctx.dom.offsetLeft}px`;
            win.style.top = `${ctx.dom.offsetTop + ctx.box.extent + 5}px`;
          }

          // console.log("create anchor(%s), target:%o", href, anchor);
          ctx.dom.addEventListener("click", (e: Event) => {
            // console.log(`click anchor:${anchorName}`);
            // get anchor dynamically.
            const anchor = ctx.flowRoot.getAnchor(anchorName);
            console.log(anchor);
            // console.log(`selected anchor:index = ${anchor.pageIndex}`);
            if (!anchor) {
              // console.error(`anchor(${anchor.name}) not found!`);
              return false;
            }
            e.preventDefault();
            if (ctx.dom.contains(win)) {
              ctx.dom.removeChild(win);
            }
            args.onClickAnchorLink(anchor);
            return false;
          });
          ctx.dom.addEventListener("setpage", (e: Event) => {
            if (ctx.dom.contains(win)) {
              ctx.dom.removeChild(win);
            }
          });
          ctx.dom.onmouseover = (e) => {
            if (win.childElementCount === 0) {
              const anchor = ctx.flowRoot.getAnchor(anchorName);
              if (!anchor) {
                return;
              }
              if (anchor.box && anchor.box.extent === 0 || !anchor.dom) {
                return;
              }
              const anchorTarget = anchor.dom.cloneNode(true) as HTMLElement;
              anchorTarget.style.left = "";
              anchorTarget.style.top = "";
              anchorTarget.style.right = "";
              anchorTarget.style.bottom = "";
              anchorTarget.style.position = "relative";
              win.appendChild(anchorTarget);
            }
            ctx.dom.appendChild(win);
          };
          ctx.dom.onmouseout = (e) => {
            if (ctx.dom.contains(win)) {
              ctx.dom.removeChild(win);
            }
          };
        }
      }
    });
  }
}

