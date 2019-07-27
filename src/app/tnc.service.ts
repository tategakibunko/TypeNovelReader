import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { CompileResult } from '../../common/models';

@Injectable({
  providedIn: 'root'
})
export class TncService {
  constructor() { }

  compile(filepath: string): Promise<CompileResult> {
    return new Promise<CompileResult>((resolve, _) => {
      ipcRenderer.once('compileResponse', (event, data: CompileResult) => {
        resolve(data);
      });
      ipcRenderer.send('compile', filepath);
    });
  }
}
