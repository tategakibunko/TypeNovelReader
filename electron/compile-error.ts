import { BrowserWindow } from 'electron';
import { NovelData, CompileEnv, CompileResult, InitialNovelData } from '../common/models';

export function compileError(win: BrowserWindow, env: CompileEnv) {
  const html = 'compile error!';
  const errors = [];
  const data: NovelData = { ...InitialNovelData };
  const result: CompileResult = { env, html, errors, data };
  win.webContents.send('compileResponse', result);
}

