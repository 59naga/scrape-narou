/* eslint-disable prefer-const,import/no-mutable-exports */
import axios from 'axios';
import cheerio from 'cheerio';
import { extractNovelData, extractShortstoryData, extractTocData } from './utils';

let scrapeNarou;
const fetch = (uri) =>
  Promise.resolve()
  .then(() => axios(uri, { headers: { 'User-Agent': 'scrape-narou', Cookie: 'over18=yes' } }))
  .then(response => response.data)
  .catch(response => {
    const $ = cheerio.load(response.data);
    const content = `${uri}\n${$('.description').text().trim()}`;
    return Promise.reject(new Error(content));
  });

scrapeNarou = (ncode, number = null) => {
  let uri = `http://ncode.syosetu.com/${ncode}/`;
  if (number != null) {
    uri += `${number}/`;
  }

  return fetch(uri)
  .then(xml => {
    if (number) {
      return { uri, ...extractNovelData(xml) };
    }
    return { uri, ...extractShortstoryData(xml) };
  });
};

scrapeNarou.r18 = (ncode, number = null) => {
  let uri = `http://novel18.syosetu.com/${ncode}/`;
  if (number != null) {
    uri += `${number}/`;
  }

  return fetch(uri)
  .then(xml => {
    if (number) {
      return { uri, ...extractNovelData(xml) };
    }
    return { uri, ...extractShortstoryData(xml) };
  });
};

scrapeNarou.toc = (ncode) => {
  const uri = `http://ncode.syosetu.com/${ncode}/`;

  return fetch(uri)
  .then(xml => ({ uri, ...extractTocData(xml) }));
};

scrapeNarou.tocR18 = (ncode) => {
  const uri = `http://novel18.syosetu.com/${ncode}/`;

  return fetch(uri)
  .then(xml => ({ uri, ...extractTocData(xml) }));
};

export default scrapeNarou;
