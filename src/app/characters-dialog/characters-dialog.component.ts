import * as path from 'path';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Character, CharaData } from 'common/models';

@Component({
  selector: 'app-characters-dialog',
  templateUrl: './characters-dialog.component.html',
  styleUrls: ['./characters-dialog.component.scss']
})
export class CharactersDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { baseImgPath: string, characters: Character[] },
  ) { }

  ngOnInit() {
  }

  charaName(charaData: CharaData): string {
    return charaData.names.join(' ') || 'No name';
  }

  charaImage(charaData: CharaData): string {
    if (!charaData.images) {
      return '';
    }
    const images = charaData.images;
    const imageKeys = Object.keys(images);
    if (imageKeys.length === 0) {
      return '';
    }
    const firstKey = imageKeys[0];
    return path.join(this.data.baseImgPath, images[firstKey]);
  }

  charaDescription(charaData: CharaData): string {
    return charaData.description || 'No description';
  }
}
