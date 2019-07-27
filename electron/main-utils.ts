import * as fs from 'fs';
import * as path from 'path';

export const isFileExists = (dir: string): boolean => {
  try {
    fs.statSync(dir);
    return true;
  } catch (err) {
    return err.code !== 'ENOENT';
  }
};

export const mkdirp = (dir: string) => {
  if (dir === '.' || isFileExists(dir)) {
    return;
  }
  // check that parent dir is generated before mkdir.
  mkdirp(path.dirname(dir));
  fs.mkdirSync(dir);
};

