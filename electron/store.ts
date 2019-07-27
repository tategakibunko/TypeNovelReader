import * as electron from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// [original](https://gist.github.com/ccnokes/95cb454860dbf8577e88d734c3f31e08#file-store-js)
export class Store {
  public path: string;
  public data: any;

  constructor(configName: string) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, configName + '.json');
    this.data = this.loadDataFile(this.path);
  }

  public get(key: string) {
    return this.data[key];
  }

  public set(key: string, val: any) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  private loadDataFile(dataPath: string) {
    try {
      const data: Buffer = fs.readFileSync(dataPath);
      return JSON.parse(data.toString());
    } catch (error) {
      return {};
    }
  }
}


