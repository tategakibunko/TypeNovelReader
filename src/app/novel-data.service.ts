import { Injectable } from '@angular/core';
import * as md5 from 'md5';
import {
  CharaData,
  Character,
  ReaderWritingMode,
  NovelData,
  InitialNovelData,
} from '../../common/models';

@Injectable({
  providedIn: 'root'
})
export class NovelDataService {
  private defaultSpeechAvatarSize = 50;

  constructor() { }

  getTheme(data: NovelData): string {
    return data.theme || InitialNovelData.theme;
  }

  getWritingMode(data: NovelData): ReaderWritingMode | undefined {
    return data.writingMode || undefined;
  }

  getTitle(data: NovelData): string {
    return data.title || InitialNovelData.title;
  }

  getAuthor(data: NovelData): string {
    return data.author || InitialNovelData.author;
  }

  getEmail(data: NovelData): string {
    return data.email || InitialNovelData.email;
  }

  getHomepage(data: NovelData): string {
    return data.homepage || InitialNovelData.homepage;
  }

  getGravagar(data: NovelData, size = 32): string {
    const email = this.getEmail(data);
    const hash = md5(email);
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }

  getDisplayTypeNovelError(data: NovelData): boolean {
    return (data.displayTypeNovelError === undefined) ? InitialNovelData.displayTypeNovelError : data.displayTypeNovelError;
  }

  getEnableSemanticUI(data: NovelData): boolean {
    return (data.enableSemanticUI === undefined) ? InitialNovelData.enableSemanticUI : data.enableSemanticUI;
  }

  findChara(data: NovelData, charaKey: string): CharaData | undefined {
    const characters: { [charaKey: string]: CharaData } = data.characters || {};
    return characters[charaKey];
  }

  getSpeechAvatarSize(data: NovelData): number {
    return data.speechAvatarSize || this.defaultSpeechAvatarSize;
  }

  getCharacterCount(data: NovelData): number {
    const characters = data.characters || {};
    return Object.keys(characters).length;
  }

  getCharacterArray(data: NovelData): Character[] {
    const characters = data.characters || {};
    const charaKeys = Object.keys(characters);
    return charaKeys.map(charaKey => {
      return { charaKey, charaData: characters[charaKey] };
    });
  }

  getCharacterName(data: NovelData, charaKey: string): string {
    const chara = this.findChara(data, charaKey);
    return (chara && chara.names) ? chara.names.join(' ') : charaKey;
  }

  getCharacterDescription(data: NovelData, charaKey: string): string {
    const chara = this.findChara(data, charaKey);
    return (chara && chara.description) ? chara.description : 'No description';
  }

  getCharacterImageSrc(data: NovelData, charaKey: string, imageKey: string): string {
    const chara = this.findChara(data, charaKey);
    if (!chara || !chara.images || !chara.images[imageKey]) {
      return '';
    }
    return chara.images[imageKey];
  }

  getFirstCharacterImageSrc(data: NovelData, charaKey: string): string {
    const chara = this.findChara(data, charaKey);
    if (!chara || !chara.images) {
      return '';
    }
    const imageKey = Object.keys(chara.images)[0];
    return chara.images[imageKey];
  }
}
