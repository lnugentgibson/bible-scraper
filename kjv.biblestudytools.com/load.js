const request = require('request');
//const { JSDOM } = require("jsdom");
const cheerio = require('cheerio');
const fs = require('fs');
const { URL } = require('url');

var fetchDelay = 250;

function getFetchDelay() {
  return fetchDelay;
}

function setFetchDelay(delay) {
  fetchDelay = delay;
}

const domain = {
  protocol: 'https',
  host: 'www.biblestudytools.com',
  path: ['asv']
};

function URLOpt(options) {
  const {
    protocol,
    username,
    password,
    host,
    port,
    path,
    query,
    hash
  } = options;
  return new URL(`${protocol ? protocol : "http"}://${username ? username + (password ? ":" + password : "") + "@" : ""}${host}${port ? ":" + port : ""}${path ? "/" + path.join("/") : ""}${query ? "?" + Object.keys(query).map(key => `${key}=${query[key]}`).join("&") : ""}${hash ? "#" + hash : ""}`);
}

function readLocalFile(file, onLoad, onEnoent, onError) {
  console.log("attempting to read file: " + file);
  fs.readFile(file, (err, body) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log("file, " + file + ", does not exist");
        onEnoent();
      }
      else {
        console.log("error reading file: " + file);
        onError(err);
      }
    }
    else {
      console.log("file, " + file + ", successfully read");
      onLoad(body);
    }
  });
}

function fetchRemoteFile(options, onLoad, onError) {
  setTimeout(() => {
    console.log("attempting to fetch file: " + options.url);
    request(options, (err, response, body) => {
      if (err) {
        console.log("error fetching file: " + options.url);
        onError(err);
      }
      else if (response.statusCode != 200) {
        console.log("response code for file, " + options.url + ", is " + response.statusCode);
        onError(err);
      }
      else {
        console.log("file, " + options.url + ", successfully fetched");
        onLoad(response, body);
      }
    });
  }, fetchDelay);
}

function loadLocalFile(file) {
  return new Promise((resolve, reject) => {
    readLocalFile(file, body => resolve("" + body), () => reject(), () => reject());
  });
}

function loadFile(file, options) {
  var onLoad = (resolve, response, body) => {
    if (false && response)
      fs.writeFile("response.tmp", JSON.stringify(response, null, 2), err => {
        console.log(err);
      });
    var html = "" + body;
    resolve(html);
  };
  var onError = (reject, err) => {
    console.log(err);
    reject(err);
  };
  return new Promise((resolve, reject) => {
    //console.log(`reading from ${file}`);
    readLocalFile(file, onLoad.bind(null, resolve, null), () => {
      //console.log(`file, ${file}, does not exist, fetching from ${options.url}`);
      fetchRemoteFile(options, onLoad.bind(null, body => {
        fs.writeFile(file, body, err => {
          if (err)
            console.log(err);
        });
        resolve(body);
      }), onError.bind(null, reject));
    }, onError.bind(null, reject));
  });
}

function loadMeta() {
  return loadLocalFile("meta.json").then(json => JSON.parse("" + json));
}

function applyMetaToBookManifest(book, meta) {
  var bookMeta = meta.books.filter(bookMeta => bookMeta.name.toLowerCase() === book.code)[0];
  Object.assign(book, bookMeta);
}

function applyMetaToManifest(books, meta) {
  meta.books.forEach(bookMeta => {
    var book = books.names[bookMeta.name.toLowerCase()];
    Object.assign(book, bookMeta);
  });
}

function parseIndex(html) {
  var $ = cheerio.load(html);
  var arr = [];
  var names = {};
  $("#testament-O a, #testament-N a").each((i, a) => {
    var $a = $(a);
    var href = $a.attr("href");
    var code = href.match(/\.com\/asv\/([1-3A-Za-z-]+)\//)[1];
    var name = code.replace(/-/, " ");
    var book = {
      path: href,
      name,
      code
    };
    arr.push(book);
    names[book.code] = book;
  });
  var books = {
    arr,
    names
  };
  fs.writeFile("manifest.json", JSON.stringify(books, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return books;
}

function loadManifest() {
  return loadLocalFile("manifest.json").then(json => {
    let { arr } = JSON.parse(json);
    var names = {};
    arr.forEach(book => {
      names[book.code] = book;
    });
    return {
      arr,
      names
    };
  }).catch(() => loadFile("homepage.html", {
    url: URLOpt(domain)
  }).then(html => parseIndex(html)));
}

function saveManifest(books) {
  return new Promise((resolve, reject) => {
    fs.writeFile("manifest.json", JSON.stringify(books, null, 2), "utf8", err => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else
        resolve();
    });
  });
}

function parseBook(book, html) {
  let {
    code
  } = book;
  var $ = cheerio.load(html);
  var chapters = [];
  $(`a[href]`).each((i, a) => {
    var $a = $(a);
    var href = $a.attr("href");
    var match = href.match(/https:\/\/www.biblestudytools.com\/asv\/([1-3a-z-]+)\/[0-9]+\.html/);
    if(!match)
      return;
    if(match[1] !== code)
      return;
    var number = parseInt($a.text().trim(), 10);
    chapters[number - 1] = {
      number,
      path: href,
      code: code + "-" + ("000" + number).substr(-3, 3)
    };
  });
  chapters = Object.assign({
    chapters
  }, book);
  fs.writeFile("books/" + code + ".json", JSON.stringify(chapters, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return chapters;
}

function loadBookManifest(book) {
  const {
    path,
    code
  } = book;
  return loadLocalFile("books/" + code + ".json").then(json => JSON.parse(json)).catch(() => loadFile("books/" + code + ".html", {
    url: path
  }).then(html => parseBook(book, html)));
}

function parseChapter(chapter, html) {
  let {
    code
  } = chapter;
  var $ = cheerio.load(html);
  var verses = [];
  $(".verse").each((i, div) => {
    var $div = $(div);
    var $number = $div.children(".verse-number");
    var number = parseInt($number.text(), 10);
    $number.remove();
    verses[number - 1] = {
      number,
      html: $div.html(),
      text: $div.text().trim()
    };
  });
  verses = Object.assign({
    verses
  }, chapter);
  fs.writeFile("chapters/" + code + ".json", JSON.stringify(verses, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return verses;
}

function loadChapter(chapter) {
  const {
    path,
    code
  } = chapter;
  return loadLocalFile("chapters/" + code + ".json").then(json => JSON.parse(json)).catch(() => loadFile("chapters/" + code + ".html", {
    url: path
  }).then(html => parseChapter(chapter, html)));
}

function addChapter(book, number, save) {
  let {
    path,
    code,
    chapters
  } = book;
  var chapter = chapters[number - 1];
  if (!chapter) {
    chapter = chapters[number - 1] = {
      number,
      path: path.replace(/1/, number),
      code: code + "-" + ("000" + number).substr(-3, 3)
    };
    fs.writeFile("books/" + code + ".json", JSON.stringify(book, null, 2), "utf8", err => {
      if (err)
        console.log(err);
    });
  }
  return loadChapter(chapter);
}

function addAllChapters(book) {
  var promise = addChapter(book, 1, book.numChapters == 1);
  for (var i = 2; i <= book.numChapters; i++)
    promise = (j => promise.then(() => addChapter(book, j, j == book.numChapters)))(i);
  return promise;
}

module.exports = {
  getFetchDelay,
  setFetchDelay,
  URLOpt,
  loadMeta,
  applyMetaToBookManifest,
  applyMetaToManifest,
  loadManifest,
  saveManifest,
  loadBookManifest,
  loadChapter,
  addChapter,
  addAllChapters
};
