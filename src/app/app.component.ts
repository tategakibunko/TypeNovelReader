import { Component, ElementRef, OnInit, ChangeDetectorRef, NgZone, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TncService } from './tnc.service';
import * as path from 'path';
import * as Nehan from 'nehan';
import { shell } from 'electron';
import { MatSliderChange } from '@angular/material/slider';
import { fromEvent, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import {
  CompileResult,
  TocLink,
  ReaderConfig,
  ReaderFontType,
  CharaData,
  InfoDialogData,
  SemanticSeason,
  SemanticScene,
  ReaderWritingMode,
  NovelData,
  InitialNovelData,
  BookmarkData,
  BookmarkDialogData,
} from '../../common/models';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { DeviceFontService } from './device-font.service';
import { NehanSpeakService } from './nehan-speak.service';
import { NehanSceneService } from './nehan-scene.service';
import { SemanticDataService } from './semantic-data.service';
import { NehanTipService } from './nehan-tip.service';
import { NehanIconService } from './nehan-icon.service';
import { NehanNotesService } from './nehan-notes.service';
import { NehanImgService } from './nehan-img.service';
import { NehanHeaderService } from './nehan-header.service';
import { NehanBodyService } from './nehan-body.service';
import { NehanRubyService } from './nehan-ruby.service';
import { NehanSpeechBubbleService } from './nehan-speech-bubble.service';
import { NehanSbTableService } from './nehan-sb-table.service';
import { NovelDataService } from './novel-data.service';
import { NehanOthersService } from './nehan-others.service';
import { ipcRenderer } from 'electron';
import { BookmarkDialogComponent } from './bookmark-dialog/bookmark-dialog.component';
import { BookmarkService } from './bookmark.service';
import { CharactersDialogComponent } from './characters-dialog/characters-dialog.component';
// import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatSpinner } from '@angular/material/progress-spinner';
import * as NehanAnchor from 'nehan-anchor';
import * as NehanKatex from 'nehan-katex';
import * as NehanHighlight from 'nehan-highlight';
import * as NehanSpeechBorder from 'nehan-speech-border';

const DialogWidth = 500;
const ResizeEventDelay = 500;
const MinFontSize = 12;
const MaxFontSize = 30;
const FontDelta = 2;
const MinReaderHeight = 300;
const MaxReaderHeight = 1000;
const HeightDelta = 20;
const ConfigKey = 'readerConfig';
const InitialConfig = {
  fontSize: 16,
  fontType: ('mincho' as ReaderFontType),
  writingMode: ('vertical-rl' as ReaderWritingMode),
  readerHeight: 450
};
const DefaultEncoding = 'UTF-8';

Nehan.Config.isTcyWord = (word: string, context: { prev?: Nehan.ICharacter, next?: Nehan.ICharacter }) => {
  switch (word) {
    case '!!': case '!?': case '?!': case '??': return true;
  }
  // \u203C = DOUBLE EXCLAMATION MARK
  // \u2047 = DOUBLE QUESTION MARK
  // \u2048 = QUESTION EXCLAMATION MARK
  // \u2049 = EXCLAMATION QUESTION MARK
  if (word.match(/^[\u203C\u2047-\u2049]/)) {
    return true;
  }
  /*
  const prev = context.prev;
  const next = context.next;
  if (word.match(/\d{1,2}/)) {
    if (next) {
      switch (next.text) {
        case '月': case '日': case '分': return true;
      }
    }
  }
  if (word.match(/\d{1,3}/)) {
    if (next) {
      switch (next.text) {
        case '度': case '回': return true;
      }
    }
  }
  */
  return false;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public $screen: HTMLElement;
  public $toc: HTMLElement;
  public isBusy = false;
  public isDialogOpen = false;
  public isReaderComplete = false;
  public enableSemanticUI = true;
  public displayTypeNovelError = true;
  public status = 'Drag and drop TypeNovel';
  public isFirstCompile = true;
  public lastFilePath: string | undefined = undefined;
  public lastSeekPos: number;
  public startPageIndex: number;
  public compileResult: CompileResult | undefined;
  public reader: Nehan.PagedNehanDocument;
  public pageIndex: number;
  public tocLinks: TocLink[] = [];
  public config: ReaderConfig = { ...InitialConfig };
  public curScene: SemanticScene;
  public curToc: TocLink | undefined;
  public textEncoding = DefaultEncoding;
  public spinner: OverlayRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone,
    private overlay: Overlay,
    private tnc: TncService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private dfont: DeviceFontService,
    private sdata: SemanticDataService,
    private ndata: NovelDataService,
    private bookmark: BookmarkService,
    private nehanBody: NehanBodyService,
    private nehanRuby: NehanRubyService,
    private nehanSpeak: NehanSpeakService,
    private nehanScene: NehanSceneService,
    private nehanTip: NehanTipService,
    private nehanIcon: NehanIconService,
    private nehanNotes: NehanNotesService,
    // private nehanAnchor: NehanAnchorService,
    // private nehanMath: NehanKatexService,
    // private nehanCode: NehanCodeHighlightService,
    private nehanImg: NehanImgService,
    private nehanHeader: NehanHeaderService,
    private nehanSpeechBubble: NehanSpeechBubbleService,
    private nehanSbTable: NehanSbTableService,
    private nehanOthers: NehanOthersService,
  ) { }

  ngOnInit() {
    this.curScene = {
      season: undefined,
      time: undefined,
      date: undefined
    };
    this.curToc = undefined;
    this.compileResult = undefined;
    this.lastSeekPos = 0;
    this.startPageIndex = -1;
    this.$screen = this.el.nativeElement.querySelector('#screen');
    this.$toc = this.el.nativeElement.querySelector('#toc');
    this.spinner = this.createSpinner();
    fromEvent(window, 'resize').pipe(
      debounce(() => timer(ResizeEventDelay))
    ).subscribe(event => this.onResize(event));
    this.config = this.loadConfig();
    this.$screen.style.height = this.config.readerHeight + 'px';
    (this.$screen.firstElementChild as HTMLElement).style.height = this.config.readerHeight + 'px';
    ipcRenderer.on('open_file', (event: any, filepath: string) => {
      // Ipc event can't be detected by Angular!
      this.zone.run(() => {
        this.openFile(filepath);
      });
    });
  }

  getResourcePath(filename: string): string {
    return path.join(this.compileResult.env.resourcePath, filename);
  }

  saveConfig(config: ReaderConfig) {
    localStorage.setItem(ConfigKey, JSON.stringify(config));
  }

  initConfig() {
    this.config = { ...InitialConfig };
  }

  loadConfig(): ReaderConfig {
    let config = { ...InitialConfig };
    if (localStorage.getItem(ConfigKey)) {
      config = JSON.parse(localStorage.getItem(ConfigKey));
    }
    this.saveConfig(config);
    return config;
  }

  get novelData(): NovelData {
    if (!this.compileResult) {
      return { ...InitialNovelData };
    }
    return this.compileResult.data;
  }

  get title(): string {
    return this.ndata.getTitle(this.novelData) || this.targetFileName;
  }

  get author(): string {
    return this.ndata.getAuthor(this.novelData);
  }

  get email(): string {
    return this.ndata.getEmail(this.novelData);
  }

  get pageCount(): number {
    return this.reader ? this.reader.pageCount : 0;
  }

  get homepage(): string {
    return this.ndata.getHomepage(this.novelData);
  }

  get gravatar(): string {
    return this.ndata.getGravagar(this.novelData);
  }

  get targetFilePath(): string {
    return this.compileResult ? this.compileResult.env.targetFilePath : '';
  }

  get targetFileName(): string {
    const parts = this.targetFilePath.split('/');
    return parts[parts.length - 1] || 'TOC undefined';
  }

  get tocTitle(): string {
    if (!this.curToc) {
      return this.targetFileName || 'TOC undefined';
    }
    return this.curToc.a.innerText;
  }

  get dateText(): string {
    const undefLabel = '--/--';
    if (!this.curScene) {
      return undefLabel;
    }
    return this.curScene.date || undefLabel;
  }

  get timeText(): string {
    const undefTime = '--:--';
    if (!this.curScene) {
      return undefTime;
    }
    return this.curScene.time || undefTime;
  }

  get season(): string {
    return this.curScene.season || 'unknown';
  }

  get theme(): string {
    return this.ndata.getTheme(this.novelData);
  }

  get timeImageSrc(): string {
    return this.sdata.getTimeImageSrc(this.theme, this.curScene.time);
  }

  get compileErrors(): string[] {
    if (!this.compileResult) {
      return [];
    }
    return this.compileResult.errors;
  }

  get compileTargetFilePath(): string {
    if (!this.compileResult) {
      throw new Error('compile target is not exists!');
    }
    return this.compileResult.env.targetFilePath;
  }

  get novelHtml(): string {
    if (!this.compileResult) {
      return '';
    }
    return this.compileResult.html;
  }

  get isRtlMode(): boolean {
    return this.config.writingMode === 'vertical-rl';
  }

  get isVert(): boolean {
    return this.config.writingMode.indexOf('vertical') >= 0;
  }

  get isTocEnable(): boolean {
    const tocBody = this.$toc.firstElementChild;
    if (!tocBody) {
      return false;
    }
    return tocBody.childElementCount > 0;
  }

  get characterCount(): number {
    return this.ndata.getCharacterCount(this.novelData);
  }

  openHomepage() {
    // openExternalSync is deprecated in electron(v7).
    // https://github.com/sindresorhus/caprine/issues/1153
    // remoteshell.openExternalSync(this.homepage);
    shell.openExternal(this.homepage);
  }

  openInfoDialog(data: InfoDialogData) {
    this.isDialogOpen = true;
    const dlgRef = this.dialog.open(InfoDialogComponent, { width: DialogWidth + 'px', data });
    dlgRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
    });
  }

  openCharactersDialog() {
    this.isDialogOpen = true;
    const data = {
      characters: this.ndata.getCharacterArray(this.novelData),
      baseImgPath: this.compileResult.env.resourcePath
    };
    const dlgRef = this.dialog.open(CharactersDialogComponent, { width: DialogWidth + 'px', data });
    dlgRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
    });
  }

  openBookmarkDialog(data: BookmarkDialogData) {
    this.isDialogOpen = true;
    const dlgRef = this.dialog.open(BookmarkDialogComponent, { width: DialogWidth + 'px', data });
    dlgRef.afterClosed().subscribe((bookmark: BookmarkData) => {
      this.isDialogOpen = false;
      if (bookmark) {
        this.openBookmark(bookmark);
      }
    });
  }

  openBookmark(bookmark: BookmarkData) {
    if (this.targetFilePath === bookmark.filepath) {
      this.setPage(bookmark.pageIndex);
      return;
    }
    this.textEncoding = bookmark.textEncoding || DefaultEncoding;
    this.openFile(bookmark.filepath, bookmark.pageIndex);
  }

  compileHTML(html: string): string {
    html = this.nehanRuby.preCompile(html);
    html = this.nehanSpeechBubble.preCompile(html);
    html = this.nehanTip.preCompile(html);
    html = this.nehanNotes.preCompile(html);
    return html;
  }

  setFirstConfig() {
    const data = this.novelData;
    const systemWritingMode = this.ndata.getWritingMode(data);
    if (systemWritingMode) {
      this.config.writingMode = systemWritingMode;
    }
    this.enableSemanticUI = this.ndata.getEnableSemanticUI(data);
    this.displayTypeNovelError = this.ndata.getDisplayTypeNovelError(data);
  }

  createSpinner(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position().global().centerHorizontally().centerVertically()
    });
  }

  createReader(html: string): Nehan.PagedNehanDocument {
    this.pageIndex = 0;
    this.tocLinks = [];
    if (this.isFirstCompile) {
      this.setFirstConfig();
      this.isFirstCompile = false;
    }
    const html2 = this.compileHTML(html);
    // console.log('compiled html:', html2);
    const reader = new Nehan.PagedNehanDocument(html2, {
      styleSheets: this.createStyles(this.config)
    });
    reader.render({
      onPage: (context) => {
        this.onProgressPage(context.page);
      },
      onComplete: (context) => {
        this.onCompletePage(context.time);
      }
    });
    // this.setupShortcut();
    this.saveConfig(this.config);
    // console.log('currentConfig:', this.config);
    return reader;
  }

  createStyles(config: ReaderConfig): Nehan.CssStyleSheet[] {
    const basePath = this.compileResult.env.resourcePath;
    const styles = [
      Nehan.SemanticStyle.create({ all: true }),
      this.nehanBody.create(config),
      this.nehanOthers.create(),
      this.nehanHeader.create(),
      this.nehanImg.create({ basePath }),
      this.nehanIcon.create(),
      this.createSpeechBorderStyle("start"),
      this.createSpeechBorderStyle("end"),
      this.createTipStyle(),
      this.createNotesStyle(),
      this.createSpeakStyle(),
      this.createSbTableStyle(),
      this.createAnchorStyle(),
      this.createKatexStyle(),
      this.createHighlightStyle(),
    ];
    if (this.enableSemanticUI) {
      styles.push(this.nehanScene.create());
    }
    return styles;
  }

  createSpeechBorderStyle(direction: Nehan.LogicalEdgeDirection): Nehan.CssStyleSheet {
    return NehanSpeechBorder.create({ selector: ".speech-bubble", direction });
  }

  createHighlightStyle(): Nehan.CssStyleSheet {
    return NehanHighlight.create({});
  }

  createKatexStyle(): Nehan.CssStyleSheet {
    return NehanKatex.create({});
  }

  createAnchorStyle(): Nehan.CssStyleSheet {
    return NehanAnchor.create({
      previewSpacing: 5,
      onClickAnchorLink: (anchor: Nehan.Anchor) => {
        this.setPage(anchor.pageIndex);
      }
    });
  }

  createSbTableStyle(): Nehan.CssStyleSheet {
    return this.nehanSbTable.create({
      labelFontFamily: this.dfont.getFontFamilyFromFontType('gothic'),
      avatarSize: this.ndata.getSpeechAvatarSize(this.novelData),
      onClickCharacter: (event: Event, charaKey: string) => {
        event.stopPropagation();
        const title = this.ndata.getCharacterName(this.novelData, charaKey);
        const content = this.ndata.getCharacterDescription(this.novelData, charaKey);
        const charaImage = this.ndata.getFirstCharacterImageSrc(this.novelData, charaKey);
        const image = charaImage ? this.getResourcePath(charaImage) : '';
        this.openInfoDialog({ title, content, image });
      },
      getCharacterImageSrc: (charaKey: string, imageKey: string): string => {
        return this.ndata.getCharacterImageSrc(this.novelData, charaKey, imageKey);
      },
      getCharacterName: (charaKey: string): string => {
        const chara = this.ndata.findChara(this.novelData, charaKey);
        if (!chara) {
          return charaKey;
        }
        return chara.names.join(' ');
      }
    });
  }

  createNotesStyle(): Nehan.CssStyleSheet {
    return this.nehanNotes.create({
      onClick: (event: Event, notes: InfoDialogData) => {
        event.stopPropagation();
        this.openInfoDialog(notes);
      }
    });
  }

  createTipStyle(): Nehan.CssStyleSheet {
    return this.nehanTip.create({
      fontFamily: this.dfont.getFontFamilyFromFontType('gothic'),
      onClick: (event: Event, tip: InfoDialogData) => {
        event.stopPropagation();
        this.openInfoDialog(tip);
      }
    });
  }

  createSpeakStyle(): Nehan.CssStyleSheet {
    return this.nehanSpeak.create({
      onClick: (event: Event, charaKey: string) => {
        event.stopPropagation();
        const chara: CharaData = this.ndata.findChara(this.novelData, charaKey);
        const title = chara ? chara.names.join('') : charaKey;
        const charaImage = this.ndata.getFirstCharacterImageSrc(this.novelData, charaKey);
        const image = charaImage ? this.getResourcePath(charaImage) : '';
        const content = chara ? chara.description : 'No description';
        this.openInfoDialog({ title, content, image });
      },
      getTooltip: (charaKey: string) => {
        const chara = this.ndata.findChara(this.novelData, charaKey);
        if (!chara) {
          return charaKey;
        }
        return chara.names.join('');
      }
    });
  }

  onProgressPage(page: Nehan.Page) {
    if ((page.index === this.startPageIndex) ||
      (this.lastSeekPos === 0 && page.index === 0) ||
      (this.lastSeekPos > 0 && page.acmCharCount >= this.lastSeekPos && this.isBusy)) {
      this.setBusy(false, '');
      this.setPage(page.index);
    }
  }

  onCompletePage(time: number) {
    this.setBusy(false, '');
    this.isReaderComplete = true;
    const toc: HTMLElement = this.createOutline();
    if (toc.childElementCount === 0) {
      this.$toc.innerHTML = '目次はありません。';
    } else if (this.$toc.firstChild) {
      this.$toc.replaceChild(toc, this.$toc.firstChild);
    } else {
      this.$toc.appendChild(toc);
    }
    this.tocLinks = this.createTocLinks(this.$toc);
    this.curToc = this.setCurrentToc(this.pageIndex);
    // this.setAnchorJump(this.reader.getPage(0).dom as HTMLElement);
  }

  createTocLinks(tocDom: HTMLElement): TocLink[] {
    return Array.from(tocDom.querySelectorAll('a')).map(a => {
      return { a, index: +a.getAttribute('href').substring(1) };
    });
  }

  createOutline(): HTMLElement {
    const etor = new Nehan.LayoutOutlineEvaluator((section) => {
      const a = document.createElement('a');
      a.appendChild(document.createTextNode(section.title));
      a.href = '#' + section.pageIndex;
      a.onclick = (e) => {
        this.setPage(section.pageIndex);
        return false;
      };
      return a;
    });
    return this.reader.createOutline(etor);
  }

  findScene(page: Nehan.Page): HTMLElement | undefined {
    const scenes = Array.from(page.dom.querySelectorAll('.nehan-e-scene')).map((e => e as HTMLElement));
    if (scenes.length === 0) {
      return undefined;
    }
    return scenes.sort((s1: HTMLElement, s2: HTMLElement) => {
      const id1 = +s1.dataset.sceneId;
      const id2 = +s2.dataset.sceneId;
      return id2 - id1;
    })[0];
  }

  onScene(scene: HTMLElement | undefined) {
    this.curScene = {
      season: scene ? scene.dataset.season as SemanticSeason : undefined,
      time: scene ? scene.dataset.time : undefined,
      date: scene ? scene.dataset.date : undefined
    };
    const bodyData = this.document.body.dataset;
    bodyData.season = this.curScene.season || '';
    bodyData.time = this.curScene.time || '';
    bodyData.date = this.curScene.date || '';
    bodyData.timeDivision = this.sdata.getTimeDivision(bodyData.time);
    bodyData.month = String(this.sdata.monthOfDate(bodyData.date));
  }

  onPage(page: Nehan.Page) {
    this.lastSeekPos = page.acmCharCount;
    const scene = this.findScene(page);
    this.onScene(scene);
  }

  setPage(index: number) {
    if (this.isDialogOpen || this.isBusy) { return; }
    const page: Nehan.Page = this.reader.getPage(index);
    this.pageIndex = index;
    if (this.$screen.firstChild) {
      this.$screen.replaceChild(page.dom, this.$screen.firstChild);
    } else {
      this.$screen.appendChild(page.dom);
    }
    this.onPage(page);
    this.curToc = this.setCurrentToc(index);
    // this.setAnchorJump(page.dom as HTMLElement);
    const setPageEvent = new Event("setpage");
    Array.from(page.dom.querySelectorAll("a[href^='#']")).forEach(link => {
      link.dispatchEvent(setPageEvent);
    });
  }

  @HostListener('document:keydown.arrowleft')
  setLeftPage() {
    this.isRtlMode ? this.setNextPage() : this.setPrevPage();
  }

  @HostListener('document:keydown.arrowright')
  setRightPage() {
    this.isRtlMode ? this.setPrevPage() : this.setNextPage();
  }

  @HostListener('document:keydown.j')
  setNextPage() {
    if (this.isDialogOpen) { return; }
    const index = Math.min(this.pageIndex + 1, this.pageCount - 1);
    if (index !== this.pageIndex) {
      this.setPage(index);
    }
  }

  @HostListener('document:keydown.k')
  setPrevPage() {
    if (this.isDialogOpen) { return; }
    const index = Math.max(this.pageIndex - 1, 0);
    if (index !== this.pageIndex) {
      this.setPage(index);
    }
  }

  setCurrentToc(index: number): TocLink | undefined {
    const len = this.tocLinks.length;
    this.tocLinks.forEach(t => t.a.classList.remove('active'));
    for (let i = 0; i < len; i++) {
      const t1 = this.tocLinks[i];
      const t2 = (i < len - 1) ? this.tocLinks[i + 1] : t1;
      if (index === t1.index) {
        t1.a.classList.add('active');
        return t1;
      }
      if (t1.index < index && index < t2.index) {
        t1.a.classList.add('active');
        return t1;
      }
      if (t1 === t2 && index > t1.index) {
        t2.a.classList.add('active');
        return t2;
      }
    }
    return undefined;
  }

  /*
  setAnchorJump(dom: HTMLElement) {
    const anchorLinks = Array.from(dom.querySelectorAll('a')).filter(a => a.href.indexOf('#') >= 0);
    anchorLinks.forEach(link => {
      const anchorName = link.href.split('#')[1];
      const page = this.reader.getAnchorPage(anchorName);
      if (page) {
        link.onclick = (event: any) => {
          event.preventDefault();
          this.setPage(page.index);
        };
      }
    });
  }
  */

  sliderChange(event: MatSliderChange) {
    this.setPage(event.value);
    event.source._elementRef.nativeElement.blur();
  }

  startSpinner() {
    this.spinner.attach(new ComponentPortal(MatSpinner));
  }

  endSpinner() {
    this.spinner.detach();
  }

  setBusy(isBusy: boolean, status: string) {
    if (!this.isBusy && isBusy) {
      this.startSpinner();
    } else if (this.isBusy && !isBusy) {
      this.endSpinner();
    }
    this.isBusy = isBusy;
    this.status = status;
  }

  updateTheme() {
    const href = `assets/themes/${this.theme}/theme.css`;
    this.document.getElementById('theme').setAttribute('href', href);
  }

  updateReader() {
    if (!this.compileResult) {
      return;
    }
    this.setBusy(true, '');
    this.reader = this.createReader(this.novelHtml);
    this.cdr.markForCheck();
  }

  openFile(filepath: string, startPageIndex?: number) {
    if (this.lastFilePath !== filepath) {
      this.isFirstCompile = true;
      this.lastSeekPos = 0;
    }
    this.lastFilePath = filepath;
    this.startPageIndex = (startPageIndex !== undefined) ? startPageIndex : -1;
    if (this.$screen.firstChild) {
      this.$screen.firstChild.remove();
    }
    this.compileFile(filepath);
  }

  compileFile(filepath: string) {
    this.setBusy(true, 'Compiling...');
    this.isReaderComplete = false;
    this.tnc.compile(filepath, this.textEncoding).then((result: CompileResult) => {
      this.onCompileDone(result);
    });
  }

  onCompileDone(result: CompileResult) {
    this.compileResult = result;
    this.updateReader();
    this.updateTheme();
  }

  onResize(event: Event) {
    this.updateReader();
  }

  onSelectEncoding(textEncoding: string) {
    if (this.textEncoding === textEncoding) {
      return;
    }
    this.textEncoding = textEncoding;
    this.lastSeekPos = 0;
    this.startPageIndex = -1;
    if (this.compileResult) {
      this.compileFile(this.compileTargetFilePath);
    }
  }

  onClickFontLarger() {
    this.config.fontSize = Math.min(this.config.fontSize + FontDelta, MaxFontSize);
    this.updateReader();
  }

  onClickFontSmaller() {
    this.config.fontSize = Math.max(this.config.fontSize - FontDelta, MinFontSize);
    this.updateReader();
  }

  onClickReaderHeightLarger() {
    this.config.readerHeight = Math.min(this.config.readerHeight + HeightDelta, MaxReaderHeight);
    this.$screen.style.height = this.config.readerHeight + 'px';
    this.updateReader();
  }

  onClickReaderHeightSmaller() {
    this.config.readerHeight = Math.max(this.config.readerHeight - HeightDelta, MinReaderHeight);
    this.$screen.style.height = this.config.readerHeight + 'px';
    this.updateReader();
  }

  onClickToggleWritingMode() {
    this.config.writingMode = this.isRtlMode ? 'horizontal-tb' : 'vertical-rl';
    this.updateReader();
  }

  onClickShowCharacters() {
    if (this.characterCount === 0) {
      return;
    }
    this.openCharactersDialog();
  }

  onClickInitializeConfig() {
    this.initConfig();
    this.$screen.style.height = this.config.readerHeight + 'px';
    this.updateReader();
  }

  onClickToggleSemanticInfoEnable() {
    this.enableSemanticUI = !this.enableSemanticUI;
    this.updateReader();
  }

  onClickRebuild() {
    this.compileFile(this.compileTargetFilePath);
  }

  onClickBookmark() {
    const newBookmark: BookmarkData = this.compileResult ? {
      title: this.title,
      filepath: this.targetFilePath,
      pageIndex: this.pageIndex,
      pageCount: this.pageCount,
      textEncoding: this.textEncoding,
    } : undefined;
    const bookmarks = this.bookmark.loadBookmarks();
    this.openBookmarkDialog({ newBookmark, bookmarks });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    this.openFile(file.path);
  }
}
