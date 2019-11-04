import { BrowserWindow } from 'electron';
import * as path from 'path';
import { CompileEnv, TnConfigFileName } from '../common/models';
import { isFileExists } from './main-utils';
import { loadNovelData } from './compile-env';
import { Tnc } from 'typenovel';

// Note that TypeNovel only accepts utf-8 for now(v.1.0.0).
// So env.textEncoding must be always 'UTF-8'.
export function compileTypeNovel(win: BrowserWindow, env: CompileEnv) {
  const resConfigFilePath = path.join(env.resourcePath, TnConfigFileName);
  if (isFileExists(resConfigFilePath)) {
    env.configFilePath = resConfigFilePath;
  }
  const data = loadNovelData(env);
  const tncResult = Tnc.fromFile(env.indexFilePath, {
    minify: true,
    format: 'html',
    config: env.configFilePath,
  });
  const html = tncResult.output;
  const errors = tncResult.errors.map(err => {
    return `${err.codePos.path} at line:${err.codePos.startLine}, col:${err.codePos.startColumn} ${err.message}`;
  });
  win.webContents.send('compileResponse', { env, html, errors, data });
}
