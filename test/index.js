import parallel from 'mocha.parallel';
import assert from 'assert';
import { rejects } from 'assert-exception';

// helper
const extractExpectTocData = (result) => {
  const { uri, count, author, authorId, title, content, chapters, episodes } = result;
  const first = chapters.length ? chapters[0].episodes[0] : episodes[0];
  const last = chapters.length ? chapters.slice(-1)[0].episodes.slice(-1)[0] : episodes.slice(-1)[0];
  return { uri, count, author, authorId, title, content, first, last };
};

// target
import scrapeNarou from '../src';

// todo: 今後updatedの変更時にテストが通らなくなる

// specs
parallel('scrapeNarou() - 抽出した内容をオブジェクトで返すべき', () => {
  it('存在しない小説はエラーページの解析結果を返すべき', async () => {
    const error = await rejects(scrapeNarou('nothing'));
    assert(error.message.match(/^http:\/\/ncode.syosetu.com\/nothing\/\nエラーが発生しました/));
  });

  it('長編の目次にアクセスした場合、エラーを返すべき', async () => {
    const error = await rejects(scrapeNarou('n9669bk'));
    assert(error.message === 'TOC can not extract');
  });

  it('「無職転生」1P', async () => {
    const result = await scrapeNarou('n9669bk', 1);
    const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = result;
    assert(uri === 'http://ncode.syosetu.com/n9669bk/1/');
    assert(page === 1);
    assert(count === 286);
    assert(author === '理不尽な孫の手');
    assert(authorId === '288399');
    assert(title === '無職転生　- 異世界行ったら本気だす -');
    assert(chapter === '第１章　幼年期');
    assert(subtitle === 'プロローグ');
    assert(content.match(/^俺は34歳住所不定無職/));
    assert(content.match(/トマトみたいに潰れて死んだ。$/));
    assert(header === '');
    assert(footer === '');
    assert(ad === '');
    assert(next === 2);
    assert(prev === null);
  });

  it('「無職転生」286P', async () => {
    const result = await scrapeNarou('n9669bk', 286);
    const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = result;
    assert(uri === 'http://ncode.syosetu.com/n9669bk/286/');
    assert(page === 286);
    assert(count === 286);
    assert(author === '理不尽な孫の手');
    assert(authorId === '288399');
    assert(title === '無職転生　- 異世界行ったら本気だす -');
    assert(chapter === '最終章　完結編');
    assert(subtitle === 'エピローグ「プロローグ・ゼロ」');
    assert(content.match(/^甲龍暦500年/));
    assert(content.match(/まだ、誰にも分からない。$/));
    assert(header === '');
    assert(footer.match(/^<br>/));
    assert(footer.match(/ご愛読、誠にありがとうございました。$/));
    assert(ad === '');
    assert(next === null);
    assert(prev === 285);
  });

  it('「エルフ転生からのチート建国記」1P', async () => {
    const result = await scrapeNarou('N5705CH', 1);
    const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = result;
    assert(uri === 'http://ncode.syosetu.com/N5705CH/1/');
    assert(page === 1);
    assert(count === 105);
    assert(author === '月夜　涙（るい）');
    assert(authorId === '509642');
    assert(title === 'エルフ転生からのチート建国記');
    assert(chapter === '第一章：エルシエ建国編');
    assert(subtitle === 'プロローグ：輪廻の魔術師');
    assert(content.match(/^俺は屋敷に設置した/));
    assert(content.match(/運命の転生が始まる。<br>$/));
    assert(header === '祝！　エルフ転生発売！　モンスター文庫から無事発売されました！　最新刊の四巻は2016/7/30に発売したよ');
    assert(footer === '');
    assert(ad.match(/^宣伝！　新作始めました！/));
    assert(ad.match(/自信作なので是非、読んでください！$/));
    assert(next === 2);
    assert(prev === null);
  });

  it('「Ｒｅ：ゼロから始める異世界生活」378P', async () => {
    const result = await scrapeNarou('n2267be', 378);
    const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = result;
    assert(uri === 'http://ncode.syosetu.com/n2267be/378/');
    assert(page === 378);
    assert(count >= 430);
    assert(author === '鼠色猫/長月達平');
    assert(authorId === '235132');
    assert(title === 'Ｒｅ：ゼロから始める異世界生活');
    assert(chapter === '第五章　『歴史を刻む星々』');
    assert(subtitle === '第五章５９　『レグルス・コルニアス』');
    assert(content.match(/^ありえないありえないありえない/));
    assert(content.match(/しっかりと叶った。<br>\n<br>$/));
    assert(header === '');
    assert(footer.match(/^<br>\n<br>/));
    assert(footer.match(/読んだ人次第。$/));
    assert(ad === '');
    assert(next === 379);
    assert(prev === 377);
  });

  it('短編「いやだってお菓子あげたらついてくるっていうからさぁ！！」', async () => {
    const result = await scrapeNarou('n1354ck');
    const { uri, author, authorId, series, seriesId, title, content, header, footer, ad } = result;
    assert(uri === 'http://ncode.syosetu.com/n1354ck/');
    assert(author === '結木さんと');
    assert(authorId === '270309');
    assert(series === 'お菓子な世界より');
    assert(seriesId === 's5859c');
    assert(title === 'いやだってお菓子あげたらついてくるっていうからさぁ！！');
    assert(content.match(/^<br>\n　混沌たる群集の中/)); // eslint-disable-line no-irregular-whitespace
    assert(content.match(/ほんとに覚えててくださいね。<br>\n<br>\n<br>\n<br>$/));
    assert(header === '');
    assert(footer === '');
    assert(ad === '');
  });

  it('短編「生活魔術師達、ダンジョンに挑む」', async () => {
    const result = await scrapeNarou('n3117cu');
    const { uri, author, authorId, series, seriesId, title, content, header, footer, ad } = result;
    assert(uri === 'http://ncode.syosetu.com/n3117cu/');
    assert(author === '丘野　境界');
    assert(authorId === '232817');
    assert(series === '');
    assert(seriesId === '');
    assert(title === '生活魔術師達、ダンジョンに挑む');
    assert(content.match(/^エムロード王立魔術学院/));
    assert(content.match(/向かったのだった。$/));
    assert(header === '');
    assert(footer === '');
    assert(ad.match(/alphapolis.co.jp/));
  });
});

parallel('.toc() - 抽出した内容をオブジェクトで返すべき', () => {
  it('短編はエラーを投げるべき', async () => {
    assert((await rejects(scrapeNarou.toc('n1354ck'))).message === 'no chapters found');
  });

  it('「無職転生」', async () => {
    assert.deepStrictEqual(
      extractExpectTocData(await scrapeNarou.toc('n9669bk')),
      {
        uri: 'http://ncode.syosetu.com/n9669bk/',
        count: 286,
        author: '理不尽な孫の手',
        authorId: '288399',
        title: '無職転生　- 異世界行ったら本気だす -',
        content: '３４歳職歴無し住所不定無職童貞のニートは、ある日家を追い出され、人生を後悔している間にトラックに轢かれて死んでしまう。目覚めた時、彼は赤ん坊になっていた。どうやら異世界に転生したらしい。<br>\n　彼は誓う、今度こそ本気だして後悔しない人生を送ると。<br>\n<br>\n【2015年4月3日23:00　完結しました】<br>\n<br>\n<br>\n<br>\n　完結後の番外編はこちらで連載中です。<br>\n　無職転生 - 蛇足編 -<br>\nhttp://ncode.syosetu.com/n4251cr/',
        first: {
          page: 1,
          subtitle: 'プロローグ',
          created: new Date('2012/11/22 17:00'),
          updated: new Date('2013/11/27 13:06'),
        },
        last: {
          page: 286,
          subtitle: 'エピローグ「プロローグ・ゼロ」',
          created: new Date('2015/04/03 23:00'),
          updated: new Date('2015/04/21 01:51'),
        },
      },
    );
  });

  it('「エルフ転生からのチート建国記」', async () => {
    assert.deepStrictEqual(
      extractExpectTocData(await scrapeNarou.toc('N5705CH')),
      {
        uri: 'http://ncode.syosetu.com/N5705CH/',
        count: 105,
        author: '月夜　涙（るい）',
        authorId: '509642',
        title: 'エルフ転生からのチート建国記',
        content: '天才魔術師は、魔術を極めないまま死にゆく運命に抗うため、記憶を残して輪廻転生する魔術を作り上げた。輪廻転生を繰り返し、三十一周目の世界で魔術師はエルフの村に住む少年シリルとなる。しかし、その村は人間に支配され、エルフは家畜のように扱われていたのだった！<br>\n十四才になり、過去の経験と知識を取り戻したシリルは幼馴染の少女を助けるために立ち上がる。一つの村からはじまり、ありとあらゆる種族が共存する理想の国を作りあげる物語。<br>\n<br>\nモンスター大賞　最優秀賞受賞しました。2016/3/30に三巻発売決定',
        first: {
          page: 1,
          subtitle: 'プロローグ：輪廻の魔術師',
          created: new Date('2014/09/21 21:44'),
          updated: new Date('2016/08/19 21:56'),
        },
        last: {
          page: 105,
          subtitle: '最終話：シリルの旅路の果て',
          created: new Date('2017/05/26 15:17'),
          updated: null,
        },
      },
    );
  });
});

parallel('.r18() - 抽出した内容をオブジェクトで返すべき', () => {
  it('存在しない小説はエラーページの解析結果を返すべき', async () => {
    const error = await rejects(scrapeNarou.r18('nothing'));
    assert(error.message.match(/^http:\/\/novel18.syosetu.com\/nothing\/\nエラーが発生しました/));
  });

  it('長編の目次にアクセスした場合、エラーを返すべき', async () => {
    const error = await rejects(scrapeNarou.r18('n9669bk'));
    assert(error.message === 'TOC can not extract');
  });

  it('「エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。」1P', async () => {
    const result = await scrapeNarou.r18('n7663ct', 1);
    const { uri, page, count, author, authorId, title, chapter, subtitle, content, header, footer, ad, next, prev } = result;
    assert(uri === 'http://novel18.syosetu.com/n7663ct/1/');
    assert(page === 1);
    assert(count >= 340);
    assert(author === '磯貝武連');
    assert(authorId === 'x8841n');
    assert(title === 'エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。');
    assert(chapter === '');
    assert(subtitle === '詐欺師からの大出世');
    assert(content.match(/^荘厳かつ華麗でありながら/));
    assert(content.match(/弦楽器にしてやりたくなるキースだった。$/));
    assert(header === '');
    assert(footer === 'もう一つ書かせてもらっている方が全然エロくならないので、エロが書きたいとフラストレーションが溜まった結果出来た作品です。');
    assert(ad === '');
    assert(next === 2);
    assert(prev === null);
  });

  it('短編「姫将軍の肖像」', async () => {
    const result = await scrapeNarou.r18('N6823CH');
    const { uri, author, authorId, series, seriesId, title, content, header, footer, ad } = result;
    assert(uri === 'http://novel18.syosetu.com/N6823CH/');
    assert(author === 'きー子');
    assert(authorId === 'x8570b');
    assert(series === '');
    assert(seriesId === '');
    assert(title === '姫将軍の肖像');
    assert(content.match(/^「リントブルム辺境伯軍麾下へ/));
    assert(content.match(/その少女時代の輝きがそこにあった。$/));
    assert(header === '暗いです。<br>\nエロくないです。');
    assert(footer === '');
    assert(ad.match(/webclap.com/));
  });
});

parallel('.tocR18 - 抽出した内容をオブジェクトで返すべき', () => {
  it('短編はエラーを投げるべき', async () => {
    assert((await rejects(scrapeNarou.tocR18('n1354ck'))).message === 'no chapters found');
  });

  it('「エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。」', async () => {
    assert.deepStrictEqual(
      extractExpectTocData(await scrapeNarou.tocR18('n7663ct')),
      {
        uri: 'http://novel18.syosetu.com/n7663ct/',
        count: 684,
        author: '磯貝武連',
        authorId: 'x8841n',
        title: 'エルフの国の宮廷魔導師になれたので、とりあえず姫様に性的な悪戯をしてみました。',
        content: 'キース・ブロックハウンドはしがない流浪の魔導師だったが、ひょんな事からエルフ領の小国で宮廷魔導師をする事になった。<br>\n姫君の魔術家庭教師も任された彼は、それにかこつけて世間知らずのエルフ姫に性的な悪戯を始めるのだった。<br>\n<br>\nエロは３話辺りからです。あとはただエロいだけです。<br>\n<br>\n書籍化しました。KTC様より１、２巻が発売中です。<br>\n漫画化されました。「二次元ドリームマガジン」で連載中です。',
        first: {
          page: 1,
          subtitle: '詐欺師からの大出世',
          created: new Date('2015/07/14 07:53'),
          updated: new Date('2016/01/25 20:15'),
        },
        last: {
          page: 684,
          subtitle: '最終話　とりあえず',
          created: new Date('2017/05/14 21:00'),
          updated: new Date('2017/06/16 12:09'),
        },
      },
    );
  });
});
