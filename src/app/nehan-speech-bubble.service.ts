import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';

interface SpeechBubbleArgs {
  direction?: 'before' | 'end' | 'after' | 'start';
  bgColor?: string;
  borderColor?: string;
}

const defaultStyle: SpeechBubbleArgs = {
  direction: 'start',
  bgColor: 'white',
  borderColor: '#bcbcbc'
};

@Injectable({
  providedIn: 'root'
})
export class NehanSpeechBubbleService {

  constructor() { }

  private getSpeechBubbleData(args: SpeechBubbleArgs) {
    const style = Nehan.Utils.mergeDefault(args, defaultStyle);
    switch (args.direction) {
      case 'before':
        return {
          borderDir: 'after',
          outsideBorderColor: `transparent transparent ${style.borderColor} transparent`,
          outsidePos: { before: '-22px', start: '10px' },
          insideBorderColor: new Nehan.LogicalBorderColor({
            before: 'transparent',
            end: 'transparent',
            after: `${style.bgColor}`,
            start: 'transparent'
          }),
          insidePos: new Nehan.LogicalPos({ start: -8, after: -11 })
        };
      case 'end':
        return {
          borderDir: 'start',
          outsideBorderColor: `transparent transparent transparent ${style.borderColor}`,
          outsidePos: { end: '-22px', before: '10px' },
          insideBorderColor: new Nehan.LogicalBorderColor({
            before: 'transparent',
            end: 'transparent',
            after: 'transparent',
            start: `${style.bgColor}`
          }),
          insidePos: new Nehan.LogicalPos({ end: -5, after: -8 })
        };
      case 'after':
        return {
          borderDir: 'before',
          outsideBorderColor: `${style.borderColor} transparent transparent transparent`,
          outsidePos: { after: '-22px', start: '10px' },
          insideBorderColor: new Nehan.LogicalBorderColor({
            before: `${style.bgColor}`,
            end: 'transparent',
            after: 'transparent',
            start: 'transparent'
          }),
          insidePos: new Nehan.LogicalPos({ start: -8, before: -11 })
        };
      case 'start': default:
        return {
          borderDir: 'end',
          outsideBorderColor: `transparent ${style.borderColor} transparent transparent`,
          outsidePos: { start: '-22px', before: '10px' },
          insideBorderColor: new Nehan.LogicalBorderColor({
            before: 'transparent',
            end: `${style.bgColor}`,
            after: 'transparent',
            start: 'transparent'
          }),
          insidePos: new Nehan.LogicalPos({ start: -5, after: -8 })
        };
    }
  }

  // args.direction "before" | "end" | "after" | "start"
  // args.bgColor
  // args.borderColor
  create(args: SpeechBubbleArgs = defaultStyle): Nehan.CssStyleSheet {
    const style = Nehan.Utils.mergeDefault(args, defaultStyle);
    const sbData = this.getSpeechBubbleData(args);

    return new Nehan.CssStyleSheet({
      [`.speech-bubble.${style.direction}>.content`]: {
        [`margin-${style.direction}`]: '1em',
        padding: '0.5em',
        background: style.bgColor,
        border: `2px solid ${style.borderColor}`
      },
      [`.speech-bubble.${style.direction}>.content::before`]: {
        display: 'block',
        position: 'absolute',
        content: ' ',
        measure: '0',
        extent: '0',
        'border-width': '11px',
        'border-color': `${sbData.outsideBorderColor}`, // logical
        'border-style': 'solid',
        '!logical-pos': (ctx: Nehan.DynamicStyleContext) => {
          return sbData.outsidePos;
        },
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const inner = document.createElement('div');
          const s = inner.style;
          s.position = 'absolute';
          s.display = 'block';
          s.content = ' ';
          s.width = s.height = '0';
          s.borderWidth = '8px';
          s.borderStyle = 'solid';
          // logical -> physical
          sbData.insidePos.getCss(ctx.box).apply(inner);
          sbData.insideBorderColor.getCss(ctx.box).apply(inner);
          ctx.dom.appendChild(inner);
        }
      }
    });
  }
}
