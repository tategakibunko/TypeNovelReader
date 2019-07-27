import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import { CompileEnv, CompileResult } from '../common/models';
import { loadNovelData } from './compile-env';

export function compileText(win: BrowserWindow, env: CompileEnv) {
  const text = fs.readFileSync(env.targetFilePath, { encoding: 'UTF-8' });
  const html = text.replace(/\n/g, '<br>');
  const errors = [];
  const data = loadNovelData(env);
  const result: CompileResult = { env, html, errors, data };
  win.webContents.send('compileResponse', result);
}

