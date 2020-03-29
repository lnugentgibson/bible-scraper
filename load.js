const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { URL } = require('url');

const PROTOCOLS = [
  'http',
  'https',
  'ftp'
];

function validProtocol(protocol) {
  if(protocol == undefined) return false;
  return PROTOCOLS.indexOf(protocol) > -1;
}

class Url {
  constructor(host) {
    var protocol = 'http',
    username = undefined,
    password = undefined,
    port = 0,
    path = [],
    query = {},
    hash = undefined;
    function addPathPart(part) {
      path.push(part);
    }
    function clearPath(key) {
      path = [];
    }
    function setQueryVariable(key, value) {
      query[key] = value;
    }
    function deleteQueryVariable(key) {
      delete query[key];
    }
    Object.defineProperties(this, {
      protocol: {
        get: () => protocol,
        set: v => {
          if(v != undefined) {
            if(validProtocol(v))
            protocol = v;
          }
        }
      },
      username: {
        get: () => username,
        set: v => {
          username = v;
        }
      },
      password: {
        get: () => password,
        set: v => {
          password = v;
        }
      },
      port: {
        get: () => port,
        set: v => {
          if(v == undefined) v = 0;
          else {
            var d = parseInt(v, 10);
            if(d > -1) {
              port = d;
            }
          }
        }
      },
      path: {
        get: () => [].concat(path)
      },
      hash: {
        get: () => hash,
        set: v => {
          hash = v;
        }
      },
      query: {
        get: () => Object.assign({}, query)
      },
      host: {
        get: () => host,
        set: v => {
          if(v != undefined) {
            host = v;
          }
        }
      },
      addPathPart: {
        get: () => addPathPart
      },
      clearPath: {
        get: () => clearPath
      },
      setQueryVariable: {
        get: () => setQueryVariable
      },
      deleteQueryVariable: {
        get: () => deleteQueryVariable
      },
    });
  }
  
  toString() {
    const {
      protocol,
      username,
      password,
      host,
      port,
      path,
      query,
      hash
    } = this;
    var url = protocol + '://';
    if(username) {
      url += username;
      if(password) {
        url += ':' + password;
      }
      url += '@';
    }
    url += host;
    if(port > 0) {
      url += ':' + port;
    }
    url += '/' + path.join('/');
    if(query) {
      url += '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join("&");
    }
    if(hash) {
      url += '#' + hash;
    }
    return url;
  }
}

class Loader {
  constructor() {
    var delay = 250;
    var debug = true;
    var fetching = true;
    var fetchQueue = [];
    function fetch() {
      if(fetching) {
        if(fetchQueue.length) {
          var task = fetchQueue.splice(0, 1)[0];
          let {url} = task;
          request(url, (err, response, body) => {
            if (err) {
              if(debug) console.log("error fetching file: " + url);
              task.error = err;
              //reject(err);
            }
            else if (response.statusCode != 200) {
              var message = "response code for file, " + url + ", is " + response.statusCode;
              if(debug) console.log(message);
              task.error = {message};
              //reject(err);
            }
            else {
              if(debug) console.log("file, " + url + ", successfully fetched");
              task.body = body;
              task.success = true;
              //resolve({body, response});
            }
          });
        }
        setTimeout(fetch, delay);
      }
    }
    fetch();
    function queue(url, resolve, reject) {
      var task = {url, resolve, reject};
      fetchQueue.push(task);
      return task;
    }
    
    let db = new sqlite3.Database('./bible.sqlite3', (err) => {
      if (err) {
        console.error(err.message);
      }
      if(debug) console.log('Connected to the bible database.');
    });
    function initializeDatabase() {
      /*
      */
      db.serialize(() => {
        function err(title, e) {
          if(e) {
            console.error(`${title} failed`);
            console.error(e.message);
          }
          else {
            console.error(`${title} succeeded`);
          }
        }
        db.run(`
          CREATE TABLE BookCategory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_index INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL UNIQUE
          )
          `, [], err.bind(null, 'CREATE TABLE BookCategory'));
        var meta = JSON.parse('' + fs.readFileSync('./meta.json'));
        var books = meta.books;
        var categories = {};
        books.forEach(book => {
          let {
            category,
            categoryIndex
          } = book;
          if(!categories[category]) {
            categories[category] = [categoryIndex,category];
          }
        });
        var placeholders = Object.keys(categories).map(() => '(?,?)').join(',');
        categories = Object.keys(categories).reduce((arr, category) => arr.concat(categories[category]), []);
        if(false) console.log(JSON.stringify(categories, null, 2));
        db.run(`
          INSERT INTO BookCategory(category_index,name)
          VALUES ${placeholders};
          `, categories, err.bind(null, 'INSERT INTO BookCategory'));
        db.run(`
          CREATE TABLE BookDescription (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_index INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL UNIQUE,
            chapters INTEGER,
            verses INTEGER,
            category_id INTEGER
          )
          `, [], err.bind(null, 'CREATE TABLE BookDescription'));
        placeholders = books.map(() => '((?),(?),(?),(?),(?),(?))').join(',');
        books = books.reduce((arr, book) => {
          let {
            index,
            name,
            fullName,
            numChapters,
            numVerses,
            categoryIndex
          } = book;
          return arr.concat([index, name, fullName, numChapters, numVerses,categoryIndex]);
        }, []);
        if(false) console.log(JSON.stringify(books, null, 2));
        db.run(`
          INSERT INTO BookDescription(book_index,name,full_name,chapters,verses,category_id)
          VALUES ${placeholders};
          `, books, err.bind(null, 'INSERT INTO BookDescription'));
        db.run(`
          CREATE TABLE Version (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL UNIQUE
          )
          `, [], err.bind(null, 'CREATE TABLE Version'));
        var versions = JSON.parse('' + fs.readFileSync('./versions.json'));
        if(false) console.log(JSON.stringify(versions, null, 2));
        var domains = [];
        var sources = [];
        versions = Object.keys(versions).map((versionCode, versionId) => {
          let {
            name,
            code,
            domains: ds
          } = versions[versionCode];
          Object.keys(ds).forEach(domain => {
            var domainId = domains.indexOf(domain);
            if(domainId < 0) {
              domains.push(domain);
              domainId = domains.length;
            }
            else {
              domainId += 1;
            }
            sources.push([domainId, versionId + 1, ds[domain].url]);
          });
          return [code, name];
        });
        if(false) console.log(JSON.stringify(versions, null, 2));
        var versionCodes = {};
        var versionNames = {};
        versions.forEach(version => {
          let [code, name] = version;
          if(versionCodes[code]) {
            console.log(`code collision: ${code}, ${name} <> ${versionCodes[code]}`);
          }
          else {
            versionCodes[code] = name;
          }
          if(versionNames[name]) {
            console.log(`name collision: ${name}, ${code} <> ${versionNames[name]}`);
          }
          else {
            versionNames[name] = code;
          }
        });
        placeholders = Object.keys(versions).map(() => '(?,?)').join(',');
        versions = versions.reduce((arr, version) => arr.concat(version), []);
        if(false) console.log(JSON.stringify(versions, null, 2));
        db.run(`
          INSERT INTO Version(code,name)
          VALUES ${placeholders};
          `, versions, err.bind(null, 'INSERT INTO Version'));
        db.run(`
          CREATE TABLE SourceDomain (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain TEXT NOT NULL UNIQUE
          )
          `, [], err.bind(null, 'CREATE TABLE SourceDomain'));
        placeholders = Object.keys(domains).map(() => '(?)').join(',');
        domains = domains.map(domain => domain);
        if(false) console.log(JSON.stringify(domains, null, 2));
        db.run(`
          INSERT INTO SourceDomain(domain)
          VALUES ${placeholders};
          `, domains, err.bind(null, 'INSERT INTO SourceDomain'));
        db.run(`
          CREATE TABLE VersionSource (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain_id INTEGER NOT NULL,
            version_id INTEGER NOT NULL,
            url TEXT NOT NULL UNIQUE,
            page TEXT
          )
          `, [], err.bind(null, 'CREATE TABLE VersionSource'));
        placeholders = Object.keys(sources).map(() => '(?,?,?)').join(',');
        sources = sources.reduce((arr, source) => arr.concat(source), []);
        if(false) console.log(JSON.stringify(sources, null, 2));
        db.run(`
          INSERT INTO VersionSource(domain_id,version_id,url)
          VALUES ${placeholders};
          `, sources, err.bind(null, 'INSERT INTO VersionSource'));
        db.run(`
          CREATE TABLE BookSource (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version_source_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            url TEXT NOT NULL UNIQUE,
            page TEXT
          )
          `, [], err.bind(null, 'CREATE TABLE BookSource'));
        db.run(`
          CREATE TABLE ChapterSource (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version_source_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            chapter INTEGER NOT NULL,
            url TEXT NOT NULL UNIQUE,
            page TEXT
          )
          `, [], err.bind(null, 'CREATE TABLE ChapterSource'));
        db.run(`
          CREATE TABLE VersionVerse (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            chapter INTEGER NOT NULL,
            verse INTEGER NOT NULL,
            content TEXT
          )
          `, [], err.bind(null, 'CREATE TABLE VersionVerse'));
      });
    }
    function getVersionSource(version, domain) {
      return new Promise((resolve, reject) => {
        var sql = `
          SELECT
            VS.id,
            url,
            page
          FROM VersionSource VS
          LEFT JOIN Version V
          ON version_id = V.id
          LEFT JOIN SourceDomain D
          ON domain_id = D.id
          WHERE
            code = ?
            AND domain = ?;
        `;
        db.get(sql, [version, domain], (err, row) => {
          if (err) {
            console.error(err.message);
            reject(err.message);
          }
          if(row) {
            var url = row.url;
            console.log(`url of VersionSource for version ${version} and domain ${domain} is ${url}`);
            resolve(row);
            return;
          }
          var msg = `No VersionSource found for version ${version} and domain ${domain}`;
          console.log(msg);
          reject(msg);
        });
      });
    }
    function setVersionSourcePage(version, domain, page) {
      return new Promise((resolve, reject) => {
        var sql = `
          SELECT VS.id
          FROM VersionSource VS
          LEFT JOIN Version V
          ON version_id = V.id
          LEFT JOIN SourceDomain D
          ON domain_id = D.id
          WHERE
            code = ?
            AND domain = ?;
        `;
        db.get(sql, [version, domain], (err, row) => {
          if (err) {
            console.error(err.message);
            reject(err.message);
          }
          if(row) {
            let { id } = row;
            console.log(`id of VersionSource for version ${version} and domain ${domain} is ${id}`);
            db.run(`
              UPDATE VersionSource
              SET page = ?
              WHERE id = ?;
              `, [Buffer.from(page, 'hex'), id], err => {
                if (err) {
                  console.error(err.message);
                  reject(err.message);
                }
                resolve();
              });
          }
          else {
            var msg = `No VersionSource found for version ${version} and domain ${domain}`;
            console.log(msg);
            reject(msg);
          }
        });
      });
    }
    function close() {
      fetching = false;
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        if(debug) console.log('Close the database connection.');
      });
    }
    
    Object.defineProperties(this, {
      delay: {
        get: () => delay,
        set: v => {
          if(v == undefined) v = 250;
          else {
            var d = parseInt(v, 10);
            if(d > 0) {
              delay = d;
            }
          }
        }
      },
      debug: {
        get: () => debug,
        set: v => {
          debug = !!v;
        }
      },
      queue: {
        get: () => queue
      },
      initializeDatabase: {
        get: () => initializeDatabase
      },
      getVersionSource: {
        get: () => getVersionSource
      },
      setVersionSourcePage: {
        get: () => setVersionSourcePage
      },
      close: {
        get: () => close
      },
    });
  }
  
  scrapeDomain(version, domain, delay) {
    let {
      queue,
      getVersionSource,
      setVersionSourcePage
    } = this;
    // read VersionSource.url
    return getVersionSource(version, domain)
    // fetch html
    .then(source => new Promise((resolve, reject) => {
      let { url, page } = source;
      if(page) {
        page = page.toString('utf8');
        console.log(page);
        resolve({body: page, save: false});
        return;
      }
      var task = queue(url, resolve, reject);
      function waitForSuccess() {
        if(task.success) {
          resolve({body: task.body, save: true});
        }
        else if(task.error) {
          reject(task.error.message);
        }
        else {
          setTimeout(waitForSuccess, delay);
        }
      }
      waitForSuccess();
    }))
    // save html to VersionSource.page
    .then(body => {
      console.log(body.body);
      if(body.save) {
        console.log('saving page');
        return setVersionSourcePage(version, domain, '' + body).then(() => body.body);
      }
      return body.body;
    })
    // parse source
    .then(body => {
      fs.writeFile('tmp.html', body, err => {
        if(err) {
          console.log(err);
        }
      });
      var $ = cheerio.load(body);
      var arr = [];
      var names = {};
      if(domain == 'biblestudytools') {
        console.log('parsing biblestudytools style page');
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
      }
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
      console.log(JSON.stringify(books, null, 2));
      return books;
    });
    // insert into BookSource
  }
}

/*
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
//*/

function applyMetaToBookManifest(book, meta) {
  var bookMeta = meta.books.filter(bookMeta => {
    if(bookMeta.name.toLowerCase() !== book.code) return false;
    return bookMeta.altName && bookMeta.altName.toLowerCase() === book.code;
  })[0];
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

module.exports = {
  Url,
  Loader,
  applyMetaToBookManifest,
  applyMetaToManifest,
  loadBookManifest,
  loadChapter,
  addChapter,
  addAllChapters
};
