import { Injectable } from '@angular/core';
// import * as Nehan from 'nehan';
import * as Nehan from '../../../nehan';
import { ReaderConfig } from '../../common/models';
import { DeviceFontService } from './device-font.service';

@Injectable({
  providedIn: 'root'
})
export class NehanBodyService {
  ReaderMargin = 28 * 2; // 28 = padding size of semantic-ui segment.

  constructor(
    private dfont: DeviceFontService,
  ) { }

  private createReaderWidth(windowWidth: number): number {
    const screenWidth = windowWidth - this.ReaderMargin;
    return screenWidth;
  }

  create(config: ReaderConfig): Nehan.CssStyleSheet {
    const isVert = config.writingMode === 'vertical-rl';
    const readerWidth = this.createReaderWidth(window.innerWidth);
    const measure = (isVert ? config.readerHeight : readerWidth) + 'px';
    const extent = (isVert ? readerWidth : config.readerHeight) + 'px';
    const fontFamily = this.dfont.getFontFamilyFromFontType(config.fontType);
    return new Nehan.CssStyleSheet({
      body: {
        measure,
        extent,
        fontFamily,
        padding: '1em 2em',
        fontSize: config.fontSize,
        writingMode: config.writingMode
      }
    });
  }
}
