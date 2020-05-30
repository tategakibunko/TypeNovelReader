import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';
import { DeviceFontService } from './device-font.service';

@Injectable({
  providedIn: 'root'
})
export class NehanOthersService {
  constructor(
    private dfont: DeviceFontService,
  ) { }

  create(): Nehan.CssStyleSheet {
    return new Nehan.CssStyleSheet({
      'p.line': {
        margin: '0'
      },
      blockquote: {
        fontSize: '0.9em',
        fontFamily: this.dfont.getFontFamilyFromFontType('gothic'),
        backgroundColor: 'white',
        borderStartStyle: 'solid',
        borderStartColor: '#EC8686',
        borderStartWidth: '2px',
        padding: '0.4em',
        margin: '1.5em'
      },
      '.gap-start': {
        marginStart: '1em'
      },
      '.gap-end': {
        marginEnd: '1em'
      }
    });
  }
}
