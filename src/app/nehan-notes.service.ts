import { Injectable } from '@angular/core';
import { CssStyleSheet, DomCallbackContext } from 'nehan';
import { InfoDialogData } from '../../common/models';

interface NotesArgs {
  onClick: (event: any, data: InfoDialogData) => void;
}

@Injectable({
  providedIn: 'root'
})
export class NehanNotesService {
  private notesId = 1;
  private notes: { [notesId: string]: InfoDialogData } = {};

  constructor() { }

  private genId(): string {
    return (this.notesId++).toString();
  }

  private reset() {
    this.notes = {};
    this.notesId = 1;
  }

  preCompile(html: string): string {
    this.reset();
    return html.replace(/<notes>([\s|\S]*?)<\/notes>/gi, (_, innerHTML) => {
      const notesId = this.genId();
      this.notes[notesId] = { title: 'Notes', innerHTML };
      return `<span class="notes" data-id="${notesId}"><icon class="info circle"></icon></span>`;
    });
  }

  create(args: NotesArgs): CssStyleSheet {
    return new CssStyleSheet({
      '.notes': {
        display: 'inline',
        fontWeight: 'bold',
        color: '#ea4c88',
        '@create': (ctx: DomCallbackContext) => {
          ctx.dom.addEventListener('click', (e: Event) => {
            // const notesId = ctx.box.element.dataset.id;
            const notesId = ctx.box.env.element.dataset.id;
            const notes = this.notes[notesId] || { title: 'Notes', content: 'no content' };
            args.onClick(e, notes);
          });
        }
      }
    });
  }
}
