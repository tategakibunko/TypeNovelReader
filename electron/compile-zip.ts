import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as yauzl from 'yauzl';
import { CompileEnv } from '../common/models';
import { compileTypeNovel } from './compile-tn';
import { mkdirp } from './main-utils';

export function compileZip(win: BrowserWindow, env: CompileEnv) {
  yauzl.open(env.targetFilePath, (err, zip) => {
    if (err) { throw err; }
    zip.on('error', (e) => { console.error(e); throw e; });
    zip.on('entry', entry => {
      const fileName = entry.fileName;
      // console.log('entry:', fileName);
      if (/^__MACOSX/i.test(fileName)) { // skip!
      } else if (/\/$/.test(fileName)) { // directory
        mkdirp(path.join(env.tempPath, fileName));
      } else if (/index\.tn$/i.test(fileName)) { // entry TypeNovel = 'index.tn'
        env.indexFilePath = path.join(env.tempPath, fileName);
        const writeStream = fs.createWriteStream(env.indexFilePath, 'utf8');
        zip.openReadStream(entry, (e, readStream) => {
          if (e) { throw e; }
          readStream.pipe(writeStream);
        });
      } else if (/\.tn$/i.test(fileName)) { // other TypeNovel
        const tnPath = path.join(env.tempPath, fileName);
        const writeStream = fs.createWriteStream(tnPath, 'utf8');
        zip.openReadStream(entry, (e, readStream) => {
          if (e) { throw e; }
          readStream.pipe(writeStream);
        });
      } else if (/tnconfig\.json$/i.test(fileName)) { // TypeNovel config
        env.configFilePath = path.join(env.tempPath, fileName);
        const writeStream = fs.createWriteStream(env.configFilePath, 'utf8');
        zip.openReadStream(entry, (e, readStream) => {
          if (e) { throw e; }
          readStream.pipe(writeStream);
        });
      } else if (/data\.json$/i.test(fileName)) { // External data
        env.dataFilePath = path.join(env.tempPath, fileName);
        const writeStream = fs.createWriteStream(env.dataFilePath, 'utf8');
        zip.openReadStream(entry, (e, readStream) => {
          if (e) { throw e; }
          readStream.pipe(writeStream);
        });
      } else if (/\.(png|jpg|jpeg|gif|bmp|svg)/i.test(fileName)) { // image files
        const imagePath = path.join(env.tempPath, fileName);
        const writeStream = fs.createWriteStream(imagePath);
        zip.openReadStream(entry, (e, readStream) => {
          if (e) { throw e; }
          readStream.pipe(writeStream);
        });
      }
    });
    zip.on('close', () => {
      if (!env.indexFilePath) {
        win.webContents.send('compileResponse', {
          filepath: env.targetFilePath,
          html: 'index.tn is not found',
          errors: [],
          data: {}
        });
        return;
      }
      const zipDirName = path.parse(env.targetFilePath).name;
      env.resourcePath = path.join(env.tempPath, zipDirName);

      // At this point, fd must be closed, but sometimes it's still open.
      // So we must wait for a while...
      setTimeout(() => {
        compileTypeNovel(win, env);
      }, 500);
    });
  });
}

