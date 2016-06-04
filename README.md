Scrape narou
---

<p align="right">
  <a href="https://npmjs.org/package/scrape-narou">
    <img src="https://img.shields.io/npm/v/scrape-narou.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/59naga/scrape-narou">
    <img src="http://img.shields.io/travis/59naga/scrape-narou.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/scrape-narou/coverage">
    <img src="https://img.shields.io/codeclimate/github/59naga/scrape-narou.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/scrape-narou">
    <img src="https://img.shields.io/codeclimate/coverage/github/59naga/scrape-narou.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/59naga/scrape-narou">
    <img src="https://img.shields.io/gemnasium/59naga/scrape-narou.svg?style=flat-square">
  </a>
</p>

「[小説家になろう](http://syosetu.com/)」非公式 **NodeJS用** 小説本文取得ライブラリ

インストール
---
```bash
npm install scrape-narou --save
```

API
---

2016年6月4日現在のHTML構成を解析し、オブジェクトを返します。今後、**小説家になろうの本家ページのHTML構成が変更になると、このライブラリは動作しなくなる** ことに注意してください。

* `scrapeNarou(ncode[, page])` -> `Promise<result>`

  指定の`ncode`の小説htmlをダウンロードして解析し、オブジェクトに変換します。長編小説の場合`page`は必須です。逆に短編小説は`page`が使用できません。内容として

 * リクエストに使用した`uri`
 * 現在のページ番号`page`
 * 最終ページ番号`last`
 * 著者名`author`
 * 著者id`authorId`
 * 小説タイトル`title`

 を持ちます。長編の場合、これに加えて

 * 小説章名`chapter`
 * 小説話名`subtitle`
 * 小説本文`content`
 * 本文はしがき`header`
 * 本文あとがき`footer`
 * 広告（著者が設定した）`ad`
 * 次ページ番号`next`
 * 前ページ番号`prev`

 を持ちます。短編の場合、上記の代わりに

 * 短編シリーズ名`series`

 を持ちます。`content`,`header`,`footer`,`ad`のhtmlは無害化せず、挿絵も削除しません。

 ```js
 import scrapeNarou from './';
 scrapeNarou('n9669bk', 1).then(result => console.log(result));
 // {
 //   uri: 'http://ncode.syosetu.com/n9669bk/1/',
 //   page: 1,
 //   count: 286,
 //   author: '理不尽な孫の手',
 //   authorId: '288399',
 //   title: '無職転生　- 異世界行ったら本気だす -',
 //   chapter: '第１章　幼年期',
 //   subtitle: 'プロローグ',
 //   content: '俺は34歳住所不定無職。（中略）トマトみたいに潰れて死んだ。',
 //   header: '',
 //   footer: '',
 //   ad: '',
 //   next: 2,
 //   prev: null,
 // }

 scrapeNarou('n1354ck').then(result => console.log(result));
 // {
 //   uri: 'http://ncode.syosetu.com/n1354ck/',
 //   author: '結木さんと',
 //   authorId: '270309',
 //   series: 'お菓子な世界より',
 //   title: 'いやだってお菓子あげたらついてくるっていうからさぁ！！',
 //   content: '<br>\n　混沌たる群集の中から（中略）ほんとに覚えててくださいね。<br>\n<br>\n<br>\n<br>'
 // }
 ```

* `scrapeNarou.18(ncode[, page])` -> `Promise<result>`

  `scrapeNarou`と同じですが、ダウンロード先を`http://novel18.syosetu.com/`に変更します。
  また、著者id`authorId`は`なろう小説18禁API`の`xid`に変わる点に注意して下さい（一般プロフィールで使われるidと別扱いです）。

* `scrapeNarou.toc(ncode)` -> `Promise<result>`

  指定の`ncode`の目次htmlをダウンロードして解析し、オブジェクトに変換します。短編小説に対して使用するとエラーになります。内容として

  * リクエストに使用した`uri`
  * ページ総数`count`
  * 著者名`author`
  * 著者id`authorId`
  * 小説タイトル`title`
  * 章`chapters` または、章なし`episodes`

  を持ちます。`chapters`/`episodes`は複数の`episode`を持ち、この`episode`は

  * ページ番号`page`
  * 小説話名`subtitle`
  * 作成日時`created`
  * 更新日時`updated`

  を持ちます。

  ```js
  import scrapeNarou from './';
  scrapeNarou.toc('n9669bk').then(result => console.log(result));
  // {
  //   "uri": "http://ncode.syosetu.com/n9669bk/",
  //   "author": "理不尽な孫の手",
  //   "authorId": "288399",
  //   "title": "無職転生　- 異世界行ったら本気だす -",
  //   "count": 286,
  //   "chapters": [
  //     {
  //       "title": "第１章　幼年期",
  //       "episodes": [
  //         {
  //           "page": 1,
  //           "subtitle": "プロローグ",
  //           "created": Date {2012-11-22},
  //           "updated": Date {2013-11-27}
  //         },
  //         ...
  //       ]
  //     },
  //     ...
  //   ],
  //   "episodes": []
  // }
  ```

* `scrapeNarou.tocR18(ncode)` -> `Promise<result>`

  `scrapeNarou.toc`と同じですが、ダウンロード先を`http://novel18.syosetu.com/`に変更します。
  また、著者id`authorId`は`なろう小説18禁API`の`xid`に変わる点に注意して下さい（一般プロフィールで使われるidと別扱いです）。

謝辞
---
このアプリケーションは非公式のもので、[株式会社ヒナプロジェクト](http://hinaproject.co.jp/)が提供しているものではありません。

関連するプロジェクト
---
* [naroujs - NodeJS/ブラウザ用 なろう(小説/小説ランキング/殿堂入り/18禁小説)API JavaScriptラッパ](https://github.com/59naga/naroujs#readme)

開発環境
---
下記が[グローバルインストール](https://github.com/creationix/nvm#readme)されていることが前提です。
* NodeJS v5.11.1
* Npm v3.8.6 (or [pnpm](https://github.com/rstacruz/pnpm))

```bash
git clone https://github.com/59naga/scrape-narou
cd scrape-narou
npm install

npm test
npm run lint
```

License
---
[MIT](http://59naga.mit-license.org/)
