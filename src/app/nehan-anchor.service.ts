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
          const linkDOM = ctx.dom;
          const containerDOM = ctx.dom.parentElement ? ctx.dom.parentElement : ctx.dom;
          const panelDOM = document.createElement("div");
          const element = ctx.box.env.element;
          const href = element.getAttribute("href");
          const anchorName = href.substring(1);
          const isVert = ctx.box.env.writingMode.isTextVertical();

          panelDOM.style.padding = "1rem";
          panelDOM.style.border = "1px solid #dadada";
          panelDOM.style.position = "absolute";
          panelDOM.style.background = "white";
          panelDOM.style.zIndex = "100";

          // console.log("@create anchor link:", ctx);

          if (isVert) {
            panelDOM.style.left = `${linkDOM.offsetLeft + ctx.box.extent + 5}px`;
            panelDOM.style.top = `${linkDOM.offsetTop}px`;
          } else {
            panelDOM.style.left = `${linkDOM.offsetLeft}px`;
            panelDOM.style.top = `${linkDOM.offsetTop + ctx.box.extent + 5}px`;
          }

          linkDOM.addEventListener("click", (e: Event) => {
            const anchor = ctx.flowRoot.getAnchor(anchorName);
            if (!anchor) {
              return false;
            }
            e.preventDefault();
            if (containerDOM.contains(panelDOM)) {
              containerDOM.removeChild(panelDOM);
            }
            args.onClickAnchorLink(anchor);
            return false;
          });

          linkDOM.addEventListener("setpage", (e: Event) => {
            if (containerDOM.contains(panelDOM)) {
              containerDOM.removeChild(panelDOM);
            }
          });

          linkDOM.onmouseover = (e) => {
            if (containerDOM.contains(panelDOM)) {
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
            if (anchor.dom && panelDOM.childElementCount === 0) {
              const cloneDOM = anchor.dom.cloneNode(true) as HTMLElement;
              cloneDOM.style.left = "";
              cloneDOM.style.top = "";
              cloneDOM.style.right = "";
              cloneDOM.style.bottom = "";
              cloneDOM.style.position = "relative";
              panelDOM.appendChild(cloneDOM);
            }
            containerDOM.appendChild(panelDOM);
          };

          linkDOM.onmouseout = (e) => {
            if (containerDOM.contains(panelDOM)) {
              containerDOM.removeChild(panelDOM);
            }
          };
        }
      }
    });
  }
}
