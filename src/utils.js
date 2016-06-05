import cheerio from 'cheerio';

export function getId(href = '') {
  return href.split('/').slice(-2).join('');
}
export function getPageNumber(href = '') {
  const number = getId(href);
  if (number) {
    return Number(number);
  }
  return null;
}
export function parseJapaneseDate(text = '') {
  return new Date(text.trim().match(/\d+/g).join('-'));
}
export function extractEpisode($episode) {
  const $updated = $episode.find('.long_update span');
  const created = parseJapaneseDate($episode.find('.long_update').contents().get(0).nodeValue);
  const updated = $updated.length ? parseJapaneseDate($updated.attr('title').match(/(.*?) 改稿/)[1]) : null;
  return {
    page: getPageNumber($episode.find('.subtitle>a').attr('href')),
    subtitle: $episode.find('.subtitle').text().trim(),
    created,
    updated,
  };
}

export function extractNovelData(xml) {
  const $ = cheerio.load(xml, { decodeEntities: false });
  const $container = $('#container');
  if ($('.novel_sublist2').length) {
    throw new Error('TOC can not extract');
  }

  const [page, count] = $container.find('#novel_no').text().split('/');
  const chapter = $container.find('.chapter_title').text();
  const title = $container.find('.contents1>a').eq(0).text().trim();
  const author = $container.find('.contents1>a').eq(1).text().trim();
  const authorId = getId($container.find('.contents1>a').eq(1).attr('href'));
  const subtitle = $container.find('.novel_subtitle').text();
  const content = $container.find('#novel_honbun').html().trim();

  const header = $container.find('#novel_p').html() || '';
  const footer = $container.find('#novel_a').html() || '';

  const $ad = $container.find('#novel_contents>.center');
  $ad.find('.twitter-share-button, script').remove();
  const ad = ($ad.html() || '').trim();

  const next = getPageNumber($container.find('.novel_bn :contains("次の話")').attr('href'));
  const prev = getPageNumber($container.find('.novel_bn :contains("前の話")').attr('href'));

  return {
    page: Number(page),
    count: Number(count),
    author,
    authorId,
    title,
    chapter,
    subtitle,
    content,
    header,
    footer,
    ad,
    next,
    prev,
  };
}

export function extractShortstoryData(xml) {
  const $ = cheerio.load(xml, { decodeEntities: false });
  const $container = $('#container');
  if ($('.novel_sublist2').length) {
    throw new Error('TOC can not extract');
  }

  const author = $container.find('.novel_writername>a').text().trim();
  const authorId = getId($container.find('.novel_writername>a').attr('href'));
  const series = $container.find('.series_title>a').text().trim();
  const seriesId = getId($container.find('.series_title>a').attr('href'));
  const title = $container.find('.novel_title').text().trim();
  const content = $container.find('#novel_honbun').html().trim();

  const header = $container.find('#novel_p').html() || '';
  const footer = $container.find('#novel_a').html() || '';

  const $ad = $container.find('#novel_contents>.center');
  $ad.find('.twitter-share-button, script').remove();
  const ad = ($ad.html() || '').trim();

  return {
    author,
    authorId,
    series,
    seriesId,
    title,
    content,
    header,
    footer,
    ad,
  };
}

export function extractTocData(xml) {
  const $ = cheerio.load(xml, { decodeEntities: false });
  const $container = $('#container');
  const $chapters = $container.find('.chapter_title');
  const $rootEpisodes = $container.find('.index_box>.novel_sublist2');
  if ($chapters.length === 0 && $rootEpisodes.length === 0) {
    throw new Error('no chapters found');
  }

  const chapters = $chapters.toArray().map(chapter => {
    const title = $(chapter).text().trim();
    const episodes = [];

    let episode = $(chapter).next();
    while (episode.length && episode.prop('tagName') === 'DL') {
      episodes.push(extractEpisode(episode));
      episode = $(episode).next();
    }

    return {
      title,
      episodes,
    };
  });
  const episodes = chapters.length ? [] : $rootEpisodes.toArray().map(episode => extractEpisode($(episode)));

  const author = $container.find('.novel_writername>a').text().trim();
  const authorId = getId($container.find('.novel_writername>a').attr('href'));
  const title = $container.find('.novel_title').text().trim();
  const count = chapters.length ? chapters[chapters.length - 1].episodes.slice(-1)[0].page : episodes.length;

  return {
    author,
    authorId,
    title,
    count,
    chapters,
    episodes,
  };
}
