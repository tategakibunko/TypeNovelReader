import { Injectable } from '@angular/core';
import {
  Anchor,
  WritingMode,
  CssStyleSheet,
  DomCallbackContext,
  LogicalSize,
  PhysicalSize,
  ILogicalNode,
  LogicalCursorPos,
  IFlowRootFormatContext,
} from 'nehan';

interface Pos { x: number; y: number; }

@Injectable({
  providedIn: 'root'
})
export class NehanAnchorService {
  constructor() { }

  private createPreviewContainerDOM(padding: number): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = `${padding}px`;
    div.style.border = "1px solid #dadada";
    div.style.position = "absolute";
    div.style.background = "white";
    div.style.zIndex = "100";
    return div;
  }

  private createAnchorTargetDOM(original: HTMLElement): HTMLElement {
    const cloneDOM = original.cloneNode(true) as HTMLElement;
    cloneDOM.style.left = "";
    cloneDOM.style.top = "";
    cloneDOM.style.right = "";
    cloneDOM.style.bottom = "";
    cloneDOM.style.position = "relative";
    cloneDOM.style.color = "black";
    return cloneDOM;
  }

  private getBodySize(flowRoot: IFlowRootFormatContext): PhysicalSize {
    return new LogicalSize({
      measure: flowRoot.maxMeasure,
      extent: flowRoot.maxExtent
    }).getPhysicalSize(flowRoot.env.writingMode);
  }

  private getLogicalNodeSize(node: ILogicalNode): PhysicalSize {
    return new LogicalSize({
      measure: node.measure,
      extent: node.extent,
    }).getPhysicalSize(node.env.writingMode);
  }

  private getPreviewSize(anchorTargetNode: ILogicalNode, spacing: number): PhysicalSize {
    const size = this.getLogicalNodeSize(anchorTargetNode);
    size.width += spacing;
    size.height += spacing;
    return size;
  }

  private isPreviewEnable(anchorLinkDOM: HTMLElement, previewContDOM: HTMLElement): boolean {
    return anchorLinkDOM.contains(previewContDOM);
  }

  private deletePreview(anchorLinkDOM: HTMLElement, previewContDOM: HTMLElement) {
    if (this.isPreviewEnable(anchorLinkDOM, previewContDOM)) {
      anchorLinkDOM.removeChild(previewContDOM);
    }
  }

  private getAnchorBlockPos(node: ILogicalNode): LogicalCursorPos {
    let parent: any = node;
    while (true) {
      if (!parent) {
        break;
      }
      if (parent.pos) {
        return parent.pos;
      }
      parent = parent.parent;
    }
    return LogicalCursorPos.zero;
  }

  private getAnchorLinkPos(flowRoot: IFlowRootFormatContext, node: ILogicalNode, anchorLinkDOM: HTMLElement): Pos {
    const bodySize = this.getBodySize(flowRoot);
    const anchorBlockPos = this.getAnchorBlockPos(node);
    const mode = node.env.writingMode;
    if (mode.isTextHorizontal()) {
      return {
        x: anchorLinkDOM.offsetLeft,
        y: anchorBlockPos.before,
      };
    }
    if (mode.isVerticalRl()) {
      return {
        x: bodySize.width - anchorBlockPos.before - node.extent,
        y: anchorLinkDOM.offsetTop,
      };
    }
    return {
      x: anchorBlockPos.before,
      y: anchorLinkDOM.offsetTop,
    };
  }

  private getPreviewPos(
    writingMode: WritingMode,
    bodySize: PhysicalSize,
    anchorLinkPos: Pos,
    anchorLinkSize: PhysicalSize,
    previewSize: PhysicalSize,
    spacingSize: number): Pos {
    const ax = anchorLinkPos.x, ay = anchorLinkPos.y;
    const aw = anchorLinkSize.width, ah = anchorLinkSize.height;
    const pw = previewSize.width, ph = previewSize.height;
    const bw = bodySize.width, bh = bodySize.height;
    const ss = spacingSize;
    let x = ax, y = ay;
    if (writingMode.isTextHorizontal()) {
      const rightOver = Math.max(0, ax + pw - bw);
      const downOver = Math.max(0, ay + ah + ph - bh);
      const upOver = Math.max(0, ph - ay);
      x = (rightOver > 0) ? 0 : ax;
      y = (downOver > upOver) ? -(ph + ss * 2) : (ah + ss);
    } else {
      const rightOver = Math.max(0, ax + aw + pw - bw);
      const leftOver = Math.max(0, pw - ax);
      const downOver = Math.max(0, ay + ph - bh);
      // console.log(`downOver:${ay + ph - bh}, ay = ${ay}, ph = ${ph}, bh = ${bh}`);
      if (writingMode.isVerticalRl()) {
        x = (leftOver > rightOver) ? aw + ss : -(pw + 2 * ss);
      } else {
        x = (rightOver > leftOver) ? -(pw + 2 * ss) : aw + ss;
      }
      y = (downOver > 0) ? 0 : ay;
    }
    return { x, y };
  }

  create(args: {
    previewSpacing: number;
    onClickAnchorLink: (anchor: Anchor) => void;
  }): CssStyleSheet {
    return new CssStyleSheet({
      "a[href^=#]": {
        "@create": (ctx: DomCallbackContext) => {
          // console.log("@create anchor:", ctx);
          const anchorName = ctx.box.env.element.getAttribute("href").substring(1);
          const anchorLinkDOM = ctx.dom;
          const previewContDOM = this.createPreviewContainerDOM(5);
          const bodySize = this.getBodySize(ctx.flowRoot);
          const writingMode = ctx.box.env.writingMode;

          // console.log("create anchor(%s), target:%o", href, anchor);
          anchorLinkDOM.addEventListener("click", (e: Event) => {
            e.preventDefault();
            const anchor = ctx.flowRoot.getAnchor(anchorName);
            if (!anchor) {
              return false;
            }
            this.deletePreview(anchorLinkDOM, previewContDOM);
            args.onClickAnchorLink(anchor);
            // console.log("click:%o,%o", e, ctx);
            return false;
          });

          anchorLinkDOM.addEventListener("setpage", (e: Event) => {
            this.deletePreview(anchorLinkDOM, previewContDOM);
          });

          anchorLinkDOM.onmouseover = (e) => {
            if (this.isPreviewEnable(anchorLinkDOM, previewContDOM)) {
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
            if (anchor.dom && previewContDOM.childElementCount === 0) {
              const anchorTargetDOM = this.createAnchorTargetDOM(anchor.dom);
              previewContDOM.appendChild(anchorTargetDOM);
            }
            const anchorLinkPos = this.getAnchorLinkPos(ctx.flowRoot, ctx.box, anchorLinkDOM);
            const anchorLinkSize = this.getLogicalNodeSize(ctx.box);
            const previewSize = this.getPreviewSize(anchor.box, args.previewSpacing);
            const previewPos = this.getPreviewPos(writingMode, bodySize, anchorLinkPos, anchorLinkSize, previewSize, args.previewSpacing);

            // console.log("flowRoot:", ctx.flowRoot);
            // console.log("bodySize:", bodySize);
            // console.log("anchorLinkPos:", anchorLinkPos);
            // console.log("anchorLinkSize:", anchorLinkSize);
            // console.log("previewSize:", previewSize);
            // console.log("previewPos:", previewPos);

            previewContDOM.style.left = `${previewPos.x}px`;
            previewContDOM.style.top = `${previewPos.y}px`;

            anchorLinkDOM.appendChild(previewContDOM);
          };

          anchorLinkDOM.onmouseout = (e) => {
            this.deletePreview(anchorLinkDOM, previewContDOM);
          };
        },
      }
    });
  }
}
