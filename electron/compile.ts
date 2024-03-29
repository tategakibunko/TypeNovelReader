import { BrowserWindow, dialog } from 'electron';
import * as path from 'path';
import { CompileEnv, TnConfigFileName } from '../common/models';
import { compileText } from './compile-text';
import { compileMarkdown } from './compile-md';
import { compileHTML } from './compile-html';
import { compileTypeNovel } from './compile-tn';
import { compileError } from './compile-error';
import { compileZip } from './compile-zip';

export function compile(win: BrowserWindow, env: CompileEnv, filepath: string, textEncoding: string) {
  env.targetFilePath = filepath;
  env.resourcePath = path.dirname(filepath);
  env.textEncoding = textEncoding;

  if (/\.txt$/i.test(filepath)) {
    compileText(win, env);
  } else if (/\.md$/i.test(filepath)) {
    compileMarkdown(win, env);
  } else if (/\.html$/i.test(filepath)) {
    compileHTML(win, env);
  } else if (/\.zip$/i.test(filepath)) {
    compileZip(win, env);
  } else if (/\.tn$/i.test(filepath)) {
    env.indexFilePath = filepath;
    compileTypeNovel(win, env);
  } else {
    dialog.showErrorBox('unsupported file', 'This file format is not supported!');
    compileError(win, env);
  }
}

