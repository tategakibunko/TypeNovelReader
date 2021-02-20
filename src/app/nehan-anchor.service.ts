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
            const anchor = ctx.flowRoot.getAnchor(anchorName);
            if (!anchor) {
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
            if (ctx.dom.contains(win)) {
              return;
            }
            const anchor = ctx.flowRoot.getAnchor(anchorName);
            if (!anchor) {
              return;
            }
            if (anchor.box && anchor.box.extent === 0) {
              return;
            }
            if (anchor.box && !anchor.dom) {
              const etor = ctx.flowRoot.createLogicalNodeEvaluator();
              anchor.dom = anchor.box.acceptEvaluator(etor) as HTMLElement;
            }
            if (anchor.dom && win.childElementCount === 0) {
              const cloneDOM = anchor.dom.cloneNode(true) as HTMLElement;
              cloneDOM.style.left = "";
              cloneDOM.style.top = "";
              cloneDOM.style.right = "";
              cloneDOM.style.bottom = "";
              cloneDOM.style.position = "relative";
              win.appendChild(cloneDOM);
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

