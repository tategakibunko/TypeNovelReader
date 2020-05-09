import { Injectable } from '@angular/core';
import * as Nehan from '../../../nehan';
import { ReaderConfig } from '../../common/models';
import { DeviceFontService } from './device-font.service';

@Injectable({
  providedIn: 'root'
})
export class NehanBodyService {
  constructor(
    private dfont: DeviceFontService,
  ) { }

  create(config: ReaderConfig): Nehan.CssStyleSheet {
    const isVert = config.writingMode === 'vertical-rl';
    const semanticUISegmentPaddingSize = 28;
    const inlinePaddingSize = Math.floor(config.fontSize * 1.8);
    const blockPaddingSize = config.fontSize * 2;
    const readerWidth = window.innerWidth - semanticUISegmentPaddingSize * 2;
    const readerHeight = config.readerHeight;
    const measure = ((isVert ? readerHeight : readerWidth) - inlinePaddingSize * 2) + 'px';
    const extent = ((isVert ? readerWidth : readerHeight) - blockPaddingSize * 2) + 'px';
    const fontFamily = this.dfont.getFontFamilyFromFontType(config.fontType);
    return new Nehan.CssStyleSheet({
      body: {
        measure,
        extent,
        fontFamily,
        padding: `${blockPaddingSize}px ${inlinePaddingSize}px`,
        fontSize: config.fontSize,
        writingMode: config.writingMode,
        textAlign: 'justify',
      }
    });
  }
}
