const StreamZip = require('node-stream-zip');
var fs = require("fs");

const versions = {
  asv: {
    name: "American Standard Version",
    code: "asv",
    domains: {
      "asv.biblestudytools.com": {
        code: "asv.biblestudytools.com"
      }
    }
  },
  ceb: {
    name: "Common English Bible",
    code: "ceb",
    domains: {
      "ceb.biblestudytools.com": {
        code: "ceb.biblestudytools.com"
      }
    }
  },
  esv: {
    name: "English Standard Version",
    code: "esv",
    domains: {
      "esv.biblestudytools.com": {
        code: "esv.biblestudytools.com"
      }
    }
  },
  kjv: {
    name: "King James Version",
    code: "kjv",
    domains: {
      "kingjamesbibleonline.org": {
        code: "kingjamesbibleonline.org"
      },
      "kjv.biblestudytools.com": {
        code: "kjv.biblestudytools.com"
      }
    }
  },
  nasb: {
    name: "New American Standard Bible",
    code: "nasb",
    domains: {
      "nas.biblestudytools.com": {
        code: "nas.biblestudytools.com"
      }
    }
  },
  niv: {
    name: "New International Version",
    code: "niv",
    domains: {
      "niv.biblestudytools.com": {
        code: "niv.biblestudytools.com"
      }
    }
  },
  nkjv: {
    name: "New King James Version",
    code: "nkjv",
    domains: {
      "nkjv.biblestudytools.com": {
        code: "nkjv.biblestudytools.com"
      }
    }
  },
  nlt: {
    name: "New Living Translation",
    code: "nlt",
    domains: {
      "nlt.biblestudytools.com": {
        code: "nlt.biblestudytools.com"
      }
    }
  },
  nrs: {
    name: "New Revised Standard",
    code: "nrs",
    domains: {
      "nrs.biblestudytools.com": {
        code: "nrs.biblestudytools.com"
      }
    }
  },
  rsv: {
    name: "Revised Standard Version",
    code: "rsv",
    domains: {
      "rsv.biblestudytools.com": {
        code: "rsv.biblestudytools.com"
      }
    }
  }
};

function loadVersion(domain, onError) {
  var zip = domain.zip = new StreamZip({
    file: `${domain.code}.zip`,
    storeEntries: true
  });
  if (onError)
    zip.on('error', onError);
  return zip;
}

var manifestLoader;

function loadManifest(domain) {
  if (!domain.zip)
    loadVersion(domain);
  return manifestLoader ? manifestLoader : (domain.manifest ? Promise.resolve(domain.manifest) : new Promise((resolve, reject) => {
    domain.zip.on("ready", () => {
      resolve(domain.manifest = JSON.parse("" + domain.zip.entryDataSync(`${domain.code}/manifest.json`)));
    });
  }));
}

function printManifest(domain) {
  return loadManifest(domain).then(manifest => console.log(JSON.stringify(manifest, null, 2)));
}

function loadBookManifest(domain, bookName) {
  bookName = bookName.toLowerCase();
  return loadManifest(domain).then(manifest => {
    var book = domain.manifest.arr.filter(book => book.code.toLowerCase() === bookName)[0];
    if (!book) console.log("ERROR: LOADBOOKMANIFEST - " + bookName + ', ' + domain.code);
    var bookManifest = domain.books && domain.books[bookName] ? domain.books[bookName] : JSON.parse("" + domain.zip.entryDataSync(`${domain.code}/books/${book.code}.json`));
    if (!domain.books)
      domain.books = {};
    return domain.books[bookName] = bookManifest;
  });
}

function printBookManifest(domain, bookName) {
  loadBookManifest(domain, bookName).then(manifest => console.log(JSON.stringify(manifest, null, 2)));
}

function loadChapter(domain, bookName, chapterNumber) {
  bookName = bookName.toLowerCase();
  return loadBookManifest(domain, bookName).then(manifest => {
    var chapter = manifest.chapters[chapterNumber - 1];
    var chapterManifest = JSON.parse("" + domain.zip.entryDataSync(`${domain.code}/chapters/${chapter.code}.json`));
    if (!domain.chapters)
      domain.chapters = {};
    return domain[chapter.code] = chapterManifest;
  });
}

function printChapter(domain, bookName, chapterNumber) {
  loadChapter(domain, bookName, chapterNumber).then(manifest => console.log(JSON.stringify(manifest, null, 2)));
}

function combineManifest(save) {
  var domains = Object.keys(versions).reduce((domains, vcode) => {
    var version = versions[vcode].domains;
    return domains.concat(Object.keys(version).map(dcode => Object.assign(version[dcode], { version: vcode })));
  }, []);
  var promise = Promise.all(domains.map(domain => loadManifest(domain))).then(domains => {
    var arr = [];
    var names = {};
    var books = {
      arr,
      names
    };
    domains.forEach(manifest => {
      manifest.arr.forEach(domainBook => {
        let {
          code,
          index,
        } = domainBook;
        var book = names[code];
        if (!book) {
          book = names[code] = Object.assign({}, domainBook);
          delete book.path;
          book.numVerses = parseInt(book.numVerses.replace(/,/, ""), 10);
          arr[index - 1] = book;
        }
      });
    });
    return books;
  });
  if (save)
    promise = promise.then(books => {
      fs.writeFile(`manifest.json`, JSON.stringify(books, null, 2), "utf8", err => {
        if (err)
          console.log(err);
      });
      return books;
    });
  return promise;
}

function combineBook(bookName, save) {
  bookName = bookName.toLowerCase();
  var domains = Object.keys(versions).reduce((domains, vcode) => {
    var version = versions[vcode].domains;
    return domains.concat(Object.keys(version).map(dcode => Object.assign(version[dcode], { version: vcode })));
  }, []);
  var promise = Promise.all(domains.map(domain => loadBookManifest(domain, bookName))).then(domains => {
    var book = {
      code: bookName,
      chapters: []
    };
    domains.forEach(manifest => {
      ["name", "index", "fullName", "numChapters", "numVerses", "category", "categoryIndex"].forEach(property => {
        if (!book[property] && manifest[property])
          book[property] = manifest[property];
      });
      manifest.chapters.forEach(domainChapter => {
        let { number } = domainChapter;
        var chapter = book.chapters[number - 1];
        if (!chapter) {
          chapter = book.chapters[number - 1] = Object.assign({}, domainChapter);
          delete chapter.path;
        }
      });
    });
    book.numVerses = parseInt(book.numVerses.replace(/,/, ""), 10);
    return book;
  });
  if (save)
    promise = promise.then(book => {
      fs.writeFile(`books/${bookName}.json`, JSON.stringify(book, null, 2), "utf8", err => {
        if (err)
          console.log(err);
      });
      return book;
    });
  return promise;
}

function combineBooks(saveManifest, saveBooks) {
  return combineManifest(saveManifest).then(manifest => {
    return manifest.arr.reduce((chain, book) => {
      return chain.then(books => combineBook(book.code, saveBooks).then(bookManifest => {
        books[book.code] = bookManifest;
        return books;
      }));
    }, Promise.resolve({})).then(books => {
      return {
        manifest,
        books
      };
    });
  });
}

function combineChapter(bookName, chapterNumber, save) {
  bookName = bookName.toLowerCase();
  var domains = Object.keys(versions).reduce((domains, vcode) => {
    var version = versions[vcode].domains;
    return domains.concat(Object.keys(version).map(dcode => Object.assign(version[dcode], { version: vcode })));
  }, []);
  //console.log(JSON.stringify(domains, null, 2));
  var promise = Promise.all(domains.map(domain => loadChapter(domain, bookName, chapterNumber).then(manifest => {
    return {
      domain,
      manifest
    };
  }))).then(domains => {
    var chapter = {
      name: bookName,
      number: chapterNumber,
      verses: []
    };
    domains.forEach(domainChapter => {
      let {
        domain,
        manifest
      } = domainChapter;
      /*
      console.log({
        code: domain.code,
        version: domain.version
      });
      */
      manifest.verses.forEach(domainVerse => {
        if(!domainVerse)
          return;
        let { number } = domainVerse;
        var verse = chapter.verses[number - 1];
        if (!verse)
          verse = chapter.verses[number - 1] = {
            number,
            versions: {}
          };
        var version = verse.versions[domain.version];
        if (!version)
          version = verse.versions[domain.version] = {};
        version[domain.code] = {
          html: domainVerse.html,
          text: domainVerse.text
        };
      });
    });
    return chapter;
  });
  if (save)
    promise = promise.then(chapter => {
      fs.writeFile(`chapters/${bookName}-${("000" + chapterNumber).substr(-3, 3)}.json`, JSON.stringify(chapter, null, 2), "utf8", err => {
        if (err)
          console.log(err);
      });
    });
  return promise;
}

function combineChapters(saveManifest, saveBooks, saveChapters) {
  return combineBooks(saveManifest, saveBooks).catch(err => console.log(err)).then(data => {
    Object.keys(data.books).reduce((chain, book) => {
      var bookManifest = data.books[book];
      return bookManifest.chapters.reduce((subchain, chapter) => {
        return subchain.then(chapters => combineChapter(book, chapter.number, saveChapters).catch(err => console.log(err)).then(chapterManifest => {
          chapters[chapter.code] = chapterManifest;
          return chapters;
        }));
      }, chain);
    }, Promise.resolve({})).then(chapters => Object.assign(data, {
      chapters
    }));
  });
}

module.exports = {
  versions,
  loadManifest,
  printManifest,
  combineManifest,
  loadBookManifest,
  printBookManifest,
  combineBook,
  combineBooks,
  loadChapter,
  printChapter,
  combineChapter,
  combineChapters
};
