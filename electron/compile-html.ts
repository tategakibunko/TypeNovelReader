import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import { NovelData, CompileEnv, CompileResult } from '../common/models';
import { loadNovelData, loadText } from './compile-env';

export function compileHTML(win: BrowserWindow, env: CompileEnv) {
  // const html = fs.readFileSync(env.targetFilePath, { encoding: env.textEncoding });
  const html = loadText(env.targetFilePath, env.textEncoding);
  const errors = [];
  const data: NovelData = loadNovelData(env);
  const result: CompileResult = { env, html, errors, data };
  win.webContents.send('compileResponse', result);
}

