import { BrowserWindow } from 'electron';
import { Renderer, Marked } from 'marked-ts';
import { CompileEnv, CompileResult } from '../common/models';
import { loadNovelData, loadText } from './compile-env';

const renderer = new Renderer;
renderer.code = (code: string, exinfo?: string, escaped?: boolean): string => {
  const info = exinfo ? exinfo.split("#") : [];
  const id = info[1] || "";
  const lang = info[0] || "";
  const preOpen = id ? `<pre id="${id}">` : "<pre>";
  const codeOpen = lang ? `<code class="lang-${lang}">` : "<code>";
  return `${preOpen}${codeOpen}${code}</code></pre>`;
}
Marked.setOptions({ renderer });

export function compileMarkdown(win: BrowserWindow, env: CompileEnv) {
  // const text = fs.readFileSync(env.targetFilePath, { encoding: env.textEncoding });
  const text = loadText(env.targetFilePath, env.textEncoding);
  const html = Marked.parse(text);
  const errors = [];
  const data = loadNovelData(env);
  const result: CompileResult = { env, html, errors, data };
  win.webContents.send('compileResponse', result);
}


