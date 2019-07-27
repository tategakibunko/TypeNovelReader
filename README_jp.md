# TypeNovelReader

TypeNovelReaderは[TypeNovel](https://github.com/tategakibunko/TypeNovel)で書かれた原稿を読むためのリーダー・アプリケーションです。

TypeNovelを[SemanticNovel](https://github.com/tategakibunko/SemanticNovel)の仕様に沿って記述すると、豊富な文脈情報がUIに反映されます。

## 特徴

### TypeNovelコンパイラー入り

最新の[TypeNovel](https://github.com/tategakibunko/TypeNovel)のコンパイラーが既にアプリケーションに含まれています。

わざわざコンパイラをダウンロードして、それぞれのテキストをコンパイルする必要はありません。

### `@speak`タグを使うことで、話者の情報がUIに表示されます。

キャラクターの発言を`@speak`タグを使って記述すると、話者の情報が台詞テキストの脇に表示されます。

### 時間に反応するUI

`@scene`タグで`time`, `season`, `date`制約を記述すると、UIにその情報が反映されます。

### 縦書きと横書きの双方をサポート

横書きと縦書きの双方に対応しているので、いろいろな形式の文章に活用できます。

### その他

その他の機能については[example](https://github.com/tategakibunko/TypeNovelReader/tree/master/release)を実際に動かして確認して下さい。

## インストール

[Installers(Windows, Mac, Linux)](https://github.com/tategakibunko/TypeNovelReader/tree/master/release).

`*.exe`はWindows用のインストーラーです。

`*.dmg`はMac用のInstallerです。

`*.AppImage`はLinux用のInstallerです。

> TypeNovelReaderのバージョンは[TypeNovel](https://github.com/tategakibunko/TypeNovel)のバージョンと連動しています。つまり、TypeNovelが0.9.8ならTypeNovelReaderも0.9.8です。

## ビルド

以下のコマンドで、`release`ディレクトリ以下に実行ファイルが生成されます。

```bash
make -f Makefile.public all
```


## 使い方

`*.tn`(TypeNovelソース)や、`*.zip`(パッケージソース。詳しくは**zipソースについて**のセクションを参照のこと)、`*.html`(直接のHTML)などを、対象領域にドラッグ・アンド・ドロップするだけです。

## zipソースについて

zipソースは`index.tn`, `data.json`, `tnconfig.json`やその他のファイル(外部の`*.tn`ファイルや画像ファイル)などから構成されています。

### index.tn

作品のメインとなるソースファイルです。もし複数の`*.tn`から作品が構成されているなら、`index.tn`というファイルを入り口のソースとして利用しなければなりません。

### data.json

作品に関するその他の情報について記述したファイルです。

以下に例を示します。

```javascript
{
  "title": "サンプル作品",
  "theme": "default",
  "author": "山田太郎",
  "writingMode": "vertical-rl",
  "email": "foo@bar.com",
  "homepage": "http://foo.bar.com",
  "enableSemanticUI": true,
  "displayTypeNovelError": true,
  "speechAvatarSize": 50,
  "characters": {
    "taro": {
      "names": ["山田", "太郎"],
      "description": "山田太郎の詳細情報"
    },
    "michael": {
      "names": ["Michael", "Jackson"],
      "description": "This is MJ description"
    },
  }
}
```

`characters`のフィールドは、`@speak`タグを使用した際に参照されるデータになります。

### tnconfig.json

自分独自の`tnconfig.json`ファイルです。

もし含まれていない場合は、[初期設定のファイル](tnc/config/init.tnconfig.json)が使用されます。
