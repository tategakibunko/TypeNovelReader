import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import { NovelData, CompileEnv, CompileResult, InitialNovelData } from '../common/models';
import { loadNovelData } from './compile-env';

export function compileHTML(win: BrowserWindow, env: CompileEnv) {
  const html = fs.readFileSync(env.targetFilePath, { encoding: env.textEncoding });
  const errors = [];
  const data: NovelData = loadNovelData(env);
  const result: CompileResult = { env, html, errors, data };
  win.webContents.send('compileResponse', result);
}

