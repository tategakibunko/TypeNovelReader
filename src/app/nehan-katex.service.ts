import { Injectable } from '@angular/core';
import { CssStyleSheet, DynamicStyleContext } from 'nehan';
import * as katex from 'katex';

@Injectable({
  providedIn: 'root'
})
export class NehanKatexService {
  constructor() { }

  // TODO: prevent '\$' from escaping, because it's used as 'dollar text'.
  // current workaround is $dollar -> \text{\textdollar}
  private normalize(markup: string): string {
    return markup.trim()
      .replace(/\n/g, "")
      .replace(/\$dollar/g, "\\text{\\textdollar}")
      .replace(/\$/g, "\\")
      ;
  }

  create(args: {
    selector?: string;
    spacingSize?: number;
    margin?: string;
    normalize?: (markup: string) => string;
  }): CssStyleSheet {
    const selector = args.selector ?? "math";
    const spacingSize = args.spacingSize ?? 10;
    const normalize = args.normalize ?? this.normalize;
    return new CssStyleSheet({
      [selector]: {
        "fontSize": "0.8em",
        "!render": (ctx: DynamicStyleContext) => {
          const pcont = ctx.parentContext;
          if (!pcont) {
            return;
          }
          const isInline = ctx.element.classList.contains("inline");
          const display = isInline ? "inline-block" : "block";
          const margin = isInline ? "0" : args.margin ?? "0.5em 0";
          const backgroundColor = isInline ? "transparent" : "white";
          const isVert = pcont.env.writingMode.isTextVertical();
          const markup = normalize(ctx.element.$node.textContent);
          const maxMeasure = pcont.maxMeasure - spacingSize * 2; // padding-start(10px) + padding-end(10px)
          const $dom = document.createElement("div");

          if (isInline) {
            $dom.style.display = "inline-block";
          } else {
            $dom.style.width = `${maxMeasure}px`;
            $dom.style.padding = `${spacingSize}px`;
          }
          $dom.style.fontSize = `${ctx.emSize}px`;
          $dom.style.visibility = "hidden";

          katex.render(markup, $dom, {
            throwOnError: false
          });

          // To get accurate dom size, we need to append $dom to document-tree temporarily.
          document.body.appendChild($dom);
          const mathMeasure = isInline ? $dom.clientWidth : maxMeasure;
          const mathExtent = $dom.clientHeight;
          document.body.removeChild($dom);
          $dom.style.visibility = "visible";
          ctx.setExternalDOM($dom);

          if (isVert) {
            $dom.style.transform = `translateX(${mathExtent}px) rotateZ(90deg)`;
            $dom.style.transformOrigin = "top left";
          }
          const padding = isInline ? "0" : `${spacingSize}px`;
          const width = isVert ? mathExtent : mathMeasure;
          const height = isVert ? mathMeasure : mathExtent;

          return { display, backgroundColor, padding, margin, width, height };
        }
      }
    });
  }
}
