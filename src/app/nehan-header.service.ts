import { Injectable } from '@angular/core';
// import * as Nehan from 'nehan';
import * as Nehan from '../../../nehan';
import { DeviceFontService } from './device-font.service';

@Injectable({
  providedIn: 'root'
})
export class NehanHeaderService {
  constructor(
    private dfont: DeviceFontService,
  ) { }

  create(): Nehan.CssStyleSheet {
    const fontFamily = this.dfont.getFontFamilyFromFontType('gothic');
    const textJustify = 'none';
    const lineHeight = '1.5';
    const dynamic = Nehan.DynamicStyleUtils.smartHeader;
    return new Nehan.CssStyleSheet({
      h1: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '2rem' },
      h2: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '1.71428571rem' },
      h3: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '1.28571429rem' },
      h4: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '1.07142857rem' },
      h5: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '1rem' },
      h6: { fontFamily, textJustify, lineHeight, '!dynamic': dynamic, fontSize: '1rem' },
    });
  }
}
