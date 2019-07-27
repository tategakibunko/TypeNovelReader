# TypeNovelReader

TypeNovelReader is reader application for the text written by [TypeNovel](https://github.com/tategakibunko/TypeNovel).

If you write novel according to spec of [SemanticNovel](https://github.com/tategakibunko/SemanticNovel), plenty of context information is applied to reader UI.

## Feature

### Compiler included

Compiler of [TypeNovel](https://github.com/tategakibunko/TypeNovel) is already included in this application.

So you don't bother to download it, and compile the source any more!

### By using `@speak` tag, speaker infomation is displayed in UI

If you write speech of character by `@speak` tag, speaker information is added to the side of speech text.

### Time aware UI.

If you write `@scene` with `time`, `season`, `date` constraint, those informations are applied to UI.

### Both vertical and horizontal writing-mode are supported.

It supports both vertical writing and horizontal writing, so it can be used for various documents.

### And more!

For other functions, please run the [examples](/examples) and check it.

## Install

[Installers(Windows, Mac, Linux)](/release).

`*.exe` is Windows Installer.

`*.dmg` is Mac Installer.

`*.AppImage` is Linux Installer.

> Note that version number of this app is linked with TypeNovel version. So if the version of TypeNovel is 0.9.8, then the version of TypeNovelReader is also 0.9.8.

## Build

Artifacts are generated under the `release/` directory by the following command.

```bash
make -f Makefile.public all
```

## How to use

Just drag and drop `*.tn`(TypeNovel source), `*.zip`(Packaged soruces, see **About zip source** sesion), `*.html`(direct html) to the target window.

## About zip source

Zip source consists of `index.tn`, `data.json`, `tnconfig.json` or other files(external `*.tn` files or resource images).

### index.tn

Main source of novel. If your novel consists of multiple `*.tn` files, you should use `index.tn` as main entry of those files.

### data.json

Extra data for novel is described in this source.

Here is example.

```javascript
{
  "title": "This is my novel title",
  "theme": "default",
  "author": "Yamada Tarou",
  "writingMode": "horizontal-tb",
  "email": "foo@bar.com",
  "homepage": "http://foo.bar.com",
  "enableSemanticUI": true,
  "displayTypeNovelError": true,
  "speechAvatarSize": 50,
  "characters": {
    "taro": {
      "names": ["Yamada", "Taro"],
      "images": {
         "normal": "images/avatar2.svg"
      },
      "description": "This is Yamada Taro description"
    },
    "michael": {
      "names": ["Michael", "Jackson"],
      "images": {
        "normal": "images/avatar1.svg"
      },
      "description": "This is MJ description"
    },
  }
}
```

`characters` field is the data referenced by `@speak` tag.

### tnconfig.json

Your original `tnconfig.json`.

If it's not included, [default tnconfig.json](/tnc/config/init.tnconfig.json) is used.

## LICENSE

See [LICENSE](/LICENCE) for detail.
