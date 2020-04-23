import { Injectable } from '@angular/core';
import { ReaderFontType } from '../../common/models';

const fontFamilies = {
  windows: {
    mincho: '"游明朝", "Yu Mincho", YuMincho, "ipa-mincho", "IPA明朝", "IPA Mincho", "ＭＳ 明朝", "MS Mincho", monospace',
    gothic: '"游ゴシック", "Yu Gothic", YuGothic, "Meiryo", "メイリオ"',
  },
  android: {
    mincho: '"ipa-mincho", "IPA明朝", "IPA Mincho", monospace',
    gothic: '"游ゴシック", "Yu Gothic", YuGothic, "Osaka", "Meiryo", "メイリオ"',
  },
  macintosh: {
    mincho: '"ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "Hiragino Mincho ProN", "HiraMinProN - W3", monospace',
    gothic: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Hiragino Sans", "Osaka", monospace',
  },
  'apple-mobile': {
    mincho: '"ヒラギノ明朝 Pro W3", "Hiragino Mincho Pro", "Hiragino Mincho ProN", "HiraMinProN - W3", monospace',
    gothic: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Hiragino Sans", "Osaka", monospace',
  },
  'chrome-os': {
    mincho: '"ipa-mincho", "IPA明朝", "IPA Mincho", "ＭＳ 明朝", "MS Mincho", monospace',
    gothic: '"游ゴシック", "Yu Gothic", YuGothic, "Osaka", "Meiryo", "メイリオ"',
  },
  others: {
    mincho: '"ipa-mincho", "IPA明朝", "IPA Mincho", "ＭＳ 明朝", "MS Mincho", monospace',
    gothic: '"游ゴシック", "Yu Gothic", YuGothic, "Osaka", "Meiryo", "メイリオ"',
  }
};

const getOsType = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('iphone') >= 0 || ua.indexOf('ipod') >= 0 || ua.indexOf('ipad') >= 0) {
    return 'apple-mobile';
  }
  if (ua.indexOf('windows') >= 0) {
    return 'windows';
  }
  if (ua.indexOf('android') >= 0) {
    return 'android';
  }
  if (ua.indexOf('macintosh') >= 0) {
    return 'macintosh';
  }
  if (ua.indexOf('cros') >= 0) {
    return 'chrome-os';
  }
  return 'others';
};

@Injectable({
  providedIn: 'root'
})
export class DeviceFontService {
  constructor() { }

  getFontFamilyFromFontType(ft: ReaderFontType): string {
    const osType = getOsType();
    return fontFamilies[osType][ft];
  }
}
