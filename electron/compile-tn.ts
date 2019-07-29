import { BrowserWindow } from 'electron';
import * as child_process from 'child_process';
import * as path from 'path';
import { CompileEnv, CompileResult, TnConfigFileName } from '../common/models';
import { isFileExists } from './main-utils';
import { loadNovelData } from './compile-env';

// Note that TypeNovel only accepts utf-8 for now(v.1.0.0).
// So env.textEncoding must be always 'UTF-8'.
export function compileTypeNovel(win: BrowserWindow, env: CompileEnv) {
  const resConfigFilePath = path.join(env.resourcePath, TnConfigFileName);
  if (isFileExists(resConfigFilePath)) {
    env.configFilePath = resConfigFilePath;
  }
  const data = loadNovelData(env);
  const tncArgs = ['--release', '--config', env.configFilePath, env.indexFilePath];
  child_process.execFile(env.tncPath, tncArgs, (error, stdout, stderr) => {
    const html = stdout;
    const errors = stderr.split('\n').filter(line => line !== '');
    const result: CompileResult = { env, html, errors, data };
    // console.log('compileResult:', result);
    win.webContents.send('compileResponse', result);
  });
}

