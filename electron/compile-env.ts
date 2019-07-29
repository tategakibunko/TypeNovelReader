import { dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as Encoding from 'encoding-japanese';
import { NovelData, CompileEnv, InitialNovelData, NovelDataFileName } from '../common/models';
import { isFileExists } from './main-utils';

export function loadText(filepath: string, encoding: string): string {
  switch (encoding) {
    case 'SHIFT_JIS':
      return Encoding.convert(fs.readFileSync(filepath), { from: 'SJIS', to: 'UNICODE', type: 'string' });
    case 'EUC-JP':
      return Encoding.convert(fs.readFileSync(filepath), { from: 'EUCJP', to: 'UNICODE', type: 'string' });
  }
  return fs.readFileSync(filepath, { encoding });
}

// 1. set env.dataFilePath if loaded data exists.
// 2. return NovelData (default data or loaded data).
export function loadNovelData(env: CompileEnv): NovelData {
  const resDataFilePath = path.join(env.resourcePath, NovelDataFileName);
  let data: NovelData = { ...InitialNovelData };
  if (isFileExists(resDataFilePath)) {
    try {
      // data = JSON.parse(fs.readFileSync(resDataFilePath).toString('utf8'));
      data = JSON.parse(fs.readFileSync(resDataFilePath).toString(env.textEncoding));
      env.dataFilePath = resDataFilePath;
    } catch (err) {
      dialog.showErrorBox('json error', err);
    }
  }
  return data;
}
