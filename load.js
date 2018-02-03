const request = require('request');
//const { JSDOM } = require("jsdom");
const cheerio = require('cheerio');
const fs = require('fs');
const { URL } = require('url');

var fetchDelay = 250;
var debug = true;

function getFetchDelay() {
  return fetchDelay;
}

function setFetchDelay(delay) {
  fetchDelay = delay;
}

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
  if(debug) console.log("attempting to read file: " + file);
  fs.readFile(file, (err, body) => {
    if (err) {
      if (err.code === 'ENOENT') {
        if(debug) console.log("file, " + file + ", does not exist");
        onEnoent();
      }
      else {
        if(debug) console.log("error reading file: " + file);
        onError(err);
      }
    }
    else {
      if(debug) console.log("file, " + file + ", successfully read");
      onLoad(body);
    }
  });
}

function fetchRemoteFile(options, onLoad, onError) {
  setTimeout(() => {
    if(debug) console.log("attempting to fetch file: " + options.url);
    request(options, (err, response, body) => {
      if (err) {
        if(debug) console.log("error fetching file: " + options.url);
        onError(err);
      }
      else if (response.statusCode != 200) {
        if(debug) console.log("response code for file, " + options.url + ", is " + response.statusCode);
        onError(err);
      }
      else {
        if(debug) console.log("file, " + options.url + ", successfully fetched");
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
  return loadLocalFile(`meta.json`).then(json => JSON.parse("" + json));
}

function applyMetaToBookManifest(book, meta) {
  var bookMeta = meta.books.filter(bookMeta => bookMeta.name.toLowerCase() === book.code || bookMeta.altName && bookMeta.altName.toLowerCase() === book.code)[0];
  Object.assign(book, bookMeta);
}

function applyMetaToManifest(books, meta) {
  meta.books.forEach(bookMeta => {
    var book = books.names[bookMeta.name.toLowerCase()];
    if(!book && bookMeta.altName) {
      book = books.names[bookMeta.altName.toLowerCase()];
      delete books.names[bookMeta.altName.toLowerCase()];
      books.names[bookMeta.name.toLowerCase()] = book;
    }
    if(book) {
      Object.assign(book, bookMeta);
      book.name = bookMeta.name.replace(/-/, " ");
      book.code = bookMeta.name.toLowerCase();
    }
  });
}

function parseIndex(domain, html) {
  var $ = cheerio.load(html);
  var arr = [];
  var names = {};
  if(domain.type == 0)
    $("#testament-O a, #testament-N a").each((i, a) => {
      var $a = $(a);
      var href = $a.attr("href");
      var code = href.match(/\.com\/[a-z]{2,4}\/([1-3A-Za-z-]+)\//)[1];
      var name = code.replace(/-/, " ");
      code = code.toLowerCase();
      var book = {
        path: href,
        name,
        code
      };
      arr.push(book);
      names[book.code] = book;
    });
  else if(domain.type == 1)
    $(".column ul li a").each((i, a) => {
      var $a = $(a);
      var href = $a.attr("href");
      var code = href.match(/\/([1-3A-Za-z-]+)-Chapter-1\//)[1];
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
  fs.writeFile(`${domain.name}/manifest.json`, JSON.stringify(books, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return books;
}

function loadManifest(domain) {
  return loadLocalFile(`${domain.name}/manifest.json`).then(json => {
    let { arr } = JSON.parse(json);
    var names = {};
    arr.forEach(book => {
      names[book.code] = book;
    });
    return {
      arr,
      names
    };
  }).catch(() => loadFile(`${domain.name}/homepage.html`, {
    url: domain.url
  }).then(html => parseIndex(domain, html)));
}

function saveManifest(domain, books) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${domain.name}/manifest.json`, JSON.stringify(books, null, 2), "utf8", err => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else
        resolve();
    });
  });
}

function parseBook(domain, book, html) {
  let {
    path,
    code,
    altName
  } = book;
  var $ = cheerio.load(html);
  var chapters = [];
  if(domain.type == 0)
    $(`a[href]`).each((i, a) => {
      var $a = $(a);
      var href = $a.attr("href");
      var match = href.match(/https:\/\/www.biblestudytools.com\/([a-z]{2,4}\/)?([1-3a-z-]+)\/([0-9]+)\.html/);
      if(!match)
        return;
      //console.log(href);
      if(match[2] !== code && (!altName || match[2] !== altName.toLowerCase())) {
        //console.log("code mismatch: " + match[2] + ", " + code + (altName ? ", " + altName.toLowerCase() : ""));
        return;
      }
      var number = parseInt($a.text().trim(), 10);
      if(parseInt(match[3].trim(), 10) != number) {
        //console.log("number mismatch");
        return;
      }
      chapters[number - 1] = {
        number,
        path: href,
        code: code + "-" + ("000" + number).substr(-3, 3)
      };
    });
  else if(domain.type == 1)
    $("select[name=chapter] option").each((i, option) => {
      var $option = $(option);
      var number = parseInt($option.attr("value"), 10);
      chapters[i] = {
        number,
        path: path.replace(/1/, number),
        code: code + "-" + ("000" + number).substr(-3, 3)
      };
    });
  chapters = Object.assign({
    chapters
  }, book);
  fs.writeFile(`${domain.name}/books/${code}.json`, JSON.stringify(chapters, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return chapters;
}

function loadBookManifest(domain, book) {
  const {
    path,
    code
  } = book;
  return loadLocalFile(`${domain.name}/books/${code}.json`).then(json => JSON.parse(json)).catch(() => loadFile(`${domain.name}/books/${code}.html`, {
    url: path
  }).then(html => parseBook(domain, book, html)));
}

function parseChapter(domain, chapter, html) {
  let {
    code
  } = chapter;
  var $ = cheerio.load(html);
  var verses = [];
  if(domain.type == 0)
    $(".verse").each((i, div) => {
      var $div = $(div);
      var $number = $div.children(".verse-number");
      var number = parseInt($number.text(), 10);
      $number.remove();
      var $span = $div.children("span");
      verses[number - 1] = {
        number,
        html: $span.html().trim(),
        text: $span.text().trim()
      };
    });
  else if(domain.type == 1)
    $(".chapters_div_in p").each((i, p) => {
      var $p = $(p);
      var $a = $p.children("a");
      $a.remove();
      var number = parseInt($a.text(), 10);
      verses[number - 1] = {
        number,
        html: $p.html().trim(),
        text: $p.text().trim()
      };
    });
  verses = Object.assign({
    verses
  }, chapter);
  fs.writeFile(`${domain.name}/chapters/${code}.json`, JSON.stringify(verses, null, 2), "utf8", err => {
    if (err)
      console.log(err);
  });
  return verses;
}

function loadChapter(domain, chapter) {
  const {
    path,
    code
  } = chapter;
  return loadLocalFile(`${domain.name}/chapters/${code}.json`).then(json => JSON.parse(json)).catch(() => loadFile(`${domain.name}/chapters/${code}.html`, {
    url: path
  }).then(html => parseChapter(domain, chapter, html)));
}

function addChapter(domain, book, number, save) {
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
    fs.writeFile(`${domain.name}/books/${code}.json`, JSON.stringify(book, null, 2), "utf8", err => {
      if (err)
        console.log(err);
    });
  }
  return loadChapter(domain, chapter);
}

function addAllChapters(domain, book) {
  var promise = addChapter(domain, book, 1, book.numChapters == 1);
  for (var i = 2; i <= book.numChapters; i++)
    promise = (j => promise.then(() => addChapter(domain, book, j, j == book.numChapters)))(i);
  return promise;
}

function scrapeDomain(domain, promise) {
  if(!promise)
    promise = Promise.resolve();
  fs.mkdir(domain.name, err => {
    if (err) {
      if (err.code == 'EEXIST')
        return;
      console.log("error making directory" + domain.name);
      console.log(err);
    }
  });
  fs.mkdir(`${domain.name}/books`, err => {
    if (err) {
      if (err.code == 'EEXIST')
        return;
      console.log("error making directory" + domain.name);
      console.log(err);
    }
  });
  fs.mkdir(`${domain.name}/chapters`, err => {
    if (err) {
      if (err.code == 'EEXIST')
        return;
      console.log("error making directory" + domain.name);
      console.log(err);
    }
  });
  promise.then(() => loadManifest(domain))
  .then(books => {
    return loadMeta().then(meta => {
      applyMetaToManifest(books, meta);
      return meta;
    }).then(meta => {
      return {
        books,
        meta
      };
    });
  }).then(data => {
    return saveManifest(domain, data.books).then(() => data);
  })
  .then(data => {
    return data.books.arr.reduce((chain, book) => {
      return chain.then(() => {
        return loadBookManifest(domain, book).then(book => {
          applyMetaToBookManifest(book, data.meta);
          data[book.code] = book;
          return addAllChapters(domain, book).then(() => data);
        });
      });
    }, Promise.resolve());
  }).catch(err => {
    console.log(err);
  });
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
  addAllChapters,
  scrapeDomain
};
