import { Injectable } from '@angular/core';
import * as Nehan from 'nehan';
import { SemanticDataService } from './semantic-data.service';

@Injectable({
  providedIn: 'root'
})
export class NehanSceneService {
  private autoId = 1;

  constructor(
    private sd: SemanticDataService,
  ) { }

  private genId(): string {
    return (this.autoId++).toString();
  }

  // [Note]
  // Setting undefined to dataset converts it's type from undefined to string.
  // So if returned value is undefined, never set it to dataset!
  //
  // [Example]
  // dataset.foo = undefined; // set data-foo to undefined.
  // dataset.foo; // => 'undefined'
  // typeof(dataset.foo); // => 'string'
  private loadDataset(srcDataset: DOMStringMap, dstDataset: DOMStringMap) {
    // don't overwrite if already exists.
    if (srcDataset.time && !dstDataset.time) {
      const value = this.sd.parseAnnotValue(srcDataset.time); // string | undefined
      if (value) {
        dstDataset.time = value;
      }
    }
    // don't overwrite if already exists.
    if (srcDataset.season && !dstDataset.season) {
      const value = this.sd.parseAnnotSeason(srcDataset.season); // string | undefined
      if (value) {
        dstDataset.season = value;
      }
    }
    // don't overwrite if already exists.
    if (srcDataset.date && !dstDataset.date) {
      const value = this.sd.parseAnnotValue(srcDataset.date); // string | undefined
      if (value) {
        dstDataset.date = value;
      }
    }
  }

  create(): Nehan.CssStyleSheet {
    return new Nehan.CssStyleSheet({
      'div.scene': {
        display: 'block',
        pageBreakAfter: 'always',
        '@create': (ctx: Nehan.DomCallbackContext) => {
          const dstDOMDataset = ctx.dom.dataset;
          if (!dstDOMDataset.sceneId) {
            dstDOMDataset.sceneId = this.genId();
            const curNehanDataset = ctx.box.env.element.dataset;
            if (ctx.box.env.element.parent) {
              const srcNehanParentDataset = ctx.box.env.element.parent.dataset;
              this.loadDataset(srcNehanParentDataset, curNehanDataset);
            }
            this.loadDataset(curNehanDataset, dstDOMDataset);
          }
        }
      }
    });
  }
}
