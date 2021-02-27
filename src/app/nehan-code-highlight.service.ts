import { Injectable } from '@angular/core';
import * as hljs from 'highlight.js';
import { CssStyleSheet, DynamicStyleContext } from 'nehan';

// hljs.configure({ useBR: false });
interface DefaultArgs {
  selector?: string;
};

const defaultArgs: DefaultArgs = {
  selector: "pre>code",
};

@Injectable({
  providedIn: 'root'
})
export class NehanCodeHighlightService {
  constructor() { }

  create(args: DefaultArgs): CssStyleSheet {
    const options = { ...defaultArgs, ...args };
    return new CssStyleSheet({
      [options.selector]: {
        display: "block",
        fontSize: "smaller",
        fontFamily: "monospace",
        lineHeight: "1.6",
        whiteSpace: "pre",
        "!dynamic": (ctx: DynamicStyleContext) => {
          const lang = ctx.element.className.replace("lang-", "") || "html";
          let markup = (ctx.element.$node as HTMLElement).innerHTML.replace(/<br>/g, "\n").trim();
          if (lang === "latex") {
            markup = markup.replace(/&amp;/g, "&");
          }
          // console.log(`src(lang=${lang}):${markup}`);
          const markup2 = hljs.highlightAuto(markup, [lang]);
          // console.log("dst:", markup2.value);
          ctx.element.innerHTML = markup2.value;
          return {};
        }
      },
      // group1
      ".hljs-comment": {
        color: "#008000"
      },
      ".hljs-quote": {
        color: "#008000"
      },
      ".hljs-variable": {
        color: "#008000"
      },
      // group2
      ".hljs-keyword": {
        color: "#00f"
      },
      ".hljs-selector-tag": {
        color: "#00f"
      },
      ".hljs-built_in": {
        color: "#00f"
      },
      ".hljs-name": {
        color: "#00f"
      },
      ".hljs-tag": {
        color: "#00f"
      },
      // group3
      ".hljs-string": {
        color: "#a31515"
      },
      ".hljs-title": {
        color: "#a31515"
      },
      ".hljs-section": {
        color: "#a31515"
      },
      ".hljs-attribute": {
        color: "#a31515"
      },
      ".hljs-literal": {
        color: "#a31515"
      },
      ".hljs-template-tag": {
        color: "#a31515"
      },
      ".hljs-template-variable": {
        color: "#a31515"
      },
      ".hljs-type": {
        color: "#a31515"
      },
      ".hljs-addition": {
        color: "#a31515"
      },
      // group4
      ".hljs-deletion": {
        color: "#2b91af"
      },
      ".hljs-selector-attr": {
        color: "#2b91af"
      },
      ".hljs-selector-pseudo": {
        color: "#2b91af"
      },
      ".hljs-meta": {
        color: "#2b91af"
      },
      // group5
      ".hljs-doctag": {
        color: "#808080"
      },
      // group6
      ".hljs-attr": {
        color: "#f00",
      },
      // group7
      ".hljs-symbol": {
        color: "#00b0e8",
      },
      ".hljs-bullet": {
        color: "#00b0e8",
      },
      ".hljs-link": {
        color: "#00b0e8",
      },
      // group8
      ".hljs-emphasis": {
        fontStyle: "italic",
      },
      // group9
      ".hljs-strong": {
        fontWeight: "bold",
      }
    });
  }
}
