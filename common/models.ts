
export interface TocLink {
  a: HTMLElement;
  index: number;
}

export type ReaderWritingMode = 'vertical-rl' | 'horizontal-tb';
export type ReaderFontType = 'mincho' | 'gothic';

export interface ReaderConfig {
  fontSize: number;
  fontType: ReaderFontType;
  writingMode: ReaderWritingMode;
  readerHeight: number;
}

export interface CompileEnv {
  targetFilePath: string;
  indexFilePath: string;
  resourcePath: string;
  userDataPath: string;
  configFilePath: string;
  dataFilePath: string;
  tempPath: string; // for zipped target
  tncPath: string; // compiler path
}

export const TnConfigFileName = 'tnconfig.json';
export const NovelDataFileName = 'data.json';

export const InitialCompileEnv: CompileEnv = {
  targetFilePath: '',
  indexFilePath: '',
  resourcePath: '',
  userDataPath: '',
  configFilePath: '',
  dataFilePath: '',
  tempPath: '',
  tncPath: '',
};

export interface CompileResult {
  env: CompileEnv;
  html: string;
  errors: string[];
  data: NovelData;
}

export interface CharaData {
  names: string[]; // familyName, firstName
  images?: { [imageKey: string]: string };
  description: string;
}

export interface InfoDialogData {
  title: string;
  content?: string;
  image?: string;
  innerHTML?: string;
}

// SemanticNovel data format
export type SemanticSeason = 'spring' | 'summer' | 'autumn' | 'winter' | undefined;
export type SemanticTime = string | undefined;
export type SemanticDate = string | undefined;
export type SemanticTimeDivision = 'morning' | 'noon' | 'afternoon' | 'night';

export interface SemanticScene {
  season: SemanticSeason;
  time: SemanticTime;
  date: SemanticDate;
}

// external novel data schema
export interface NovelData {
  title: string;
  theme: string;
  author?: string;
  email?: string;
  homepage?: string;
  writingMode?: ReaderWritingMode;
  speechAvatarSize?: number;
  displayTypeNovelError?: boolean;
  enableSemanticUI?: boolean;
  characters: { [charaKey: string]: CharaData };
}

export const InitialNovelData = {
  title: 'No title',
  theme: 'default',
  author: '',
  email: 'unknown',
  homepage: '',
  displayTypeNovelError: true,
  enableSemanticUI: true,
  characters: {},
};

export interface BookmarkData {
  filepath: string;
  pageIndex: number;
}

export const BookmarkDataName = 'tnr-bookmark';
