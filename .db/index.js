const fs = require("fs");
const _ = require("lodash");

/*
function ProcessCategories() {
  fs.readFile('categories/categories.json', (err, data) => {
    if(err) {
      console.error(err);
      return;
    }
    var categories = JSON.parse('' + data);
    categories = categories.map(c => c.name);
    //console.log(JSON.stringify(categories, null, 2));
    fs.writeFile('categories/categories.json', JSON.stringify(categories), 'utf8', err => {
      if(err) console.error(err);
    });
  });
}
ProcessCategories();
//*/

/*
function ProcessMeta() {
  fs.readFile('books/meta.json', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    var books = JSON.parse('' + data);
    books = books.books.map((book, i) => {
      let {
        index,
        fullName,
        name,
        altName,
        numChapters,
        numVerses,
        categoryIndex
      } = book;

      if(index != i + 1) console.error('incorrect index: '+index+' <> '+i);
      var b = {
        fullName,
        name,
        numChapters,
        numVerses,
        category: categoryIndex - 1
      };
      if(altName) b.altName = altName;

      return b;
    });
    //console.log(JSON.stringify(categories, null, 2));
    fs.writeFile('books/books.json', JSON.stringify(books), 'utf8', err => {
      if (err) console.error(err);
    });
  });
}
ProcessMeta();
//*/

/*
function CheckBooks() {
  fs.readFile('books/books.json', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    var books = JSON.parse('' + data);
    console.log(books.length);
  });
}
CheckBooks();
//*/
fs.readFile('categories/categories.json', (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  var categories = JSON.parse('' + data);
  fs.writeFile('categories/categories.json', JSON.stringify(categories, null, 2), 'utf8', err => {
    if(err) {
      console.error(err);
    }
  });
});
fs.readFile('books/books.json', (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  var books = JSON.parse('' + data);
  fs.writeFile('books/books.json', JSON.stringify(books, null, 2), 'utf8', err => {
    if(err) {
      console.error(err);
    }
  });
});
fs.readFile('versions/versions.json', (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  var versions = JSON.parse('' + data);
  fs.writeFile('versions/versions.json', JSON.stringify(versions, null, 2), 'utf8', err => {
    if(err) {
      console.error(err);
    }
  });
});
fs.readFile('sources/sources.json', (err, data) => {
  if(err) {
    console.error(err);
    return;
  }
  var sources = JSON.parse('' + data);
  fs.writeFile('sources/sources.json', JSON.stringify(sources, null, 2), 'utf8', err => {
    if(err) {
      console.error(err);
    }
  });
});

function BibleDB() {
  var This = this;
  var promise = Promise.rsolve();

  function Table(manifestFile, fileFormat, pageSize, initTable) {
    function Page(file, pageIndex, size, initPage) {
      var rows = [], capacity = size;
      
      promise = promise.then(() => new Promise((resolve, reject) => {
        rows = _.times(size, row => ({
          row: pageIndex * size + row,
          free: true,
          value: undefined
        }));
        if(!initPage) {
          fs.readFile(file, (err, data) => {
            if(err) {
              reject(err);
              return;
            }
            var state = JSON.parse("" + data);
            capacity = state.capacity;
            state.contents.forEach(val => {
              let {row, value} = val;
              var R = rows[row - pageIndex * size];
              R.free = false;
              R.value = value;
            });
            resolve();
          });
        }
        else
          resolve();
      }));
      
      function get(index) {
        return promise = promise.then(() => {
          if(capacity == size) throw new Error('no such element');
          index -= pageIndex * size;
          if(index >= size || index < 0) throw new Error('index out of bounds');
          var row = rows[index];
          if(row.free) throw new Error('no such element');
          return row.value;
        });
      }
      function insert(value) {
        return promise = promise.then(() => {
          if(capacity == 0) throw new Error('no more capacity');
          for(var i = 0; i < size; i++) {
            var row = rows[i];
            if(!row.free) continue;
            row.free = false;
            row.value = value;
            capacity--;
            return;
          }
        });
      }
      function remove(index) {
        return promise = promise.then(() => {
          if(capacity == size) throw new Error('no such element');
          index -= pageIndex * size;
          if(index >= size || index < 0) throw new Error('index out of bounds');
          var row = rows[index];
          if(row.free) throw new Error('no such element');
          row.free = true;
          capacity++;
        });
      }
      function save() {
        return promise = promise.then(() => {
          var contents = rows.filter(row => !row.free);
          fs.writeFile(file, JSON.stringify({
            capacity,
            contents
          }, null, 2), 'utf8', err => {
            if(err) {
              console.error(err);
            }
          });
        });
      }
      Object.assign(this, {
        get,
        insert,
        remove,
        save
      });
      Object.defineProperties(this, {
        capacity: {
          get: () => capacity
        },
        promise: {
          get: () => promise
        }
      });
    }
    
    var pages;
    function pageFile(format, i) {
      return format.replace(/%(0| )?([1-9])?i/g, function(match, p1, p2) {
        var str = '' + i;
        if(p2 != undefined) {
          var width = parseInt(p2, 10);
          if(p1 == undefined) p1 = '0';
          while(str.length < width) {
            str = p1 + str;
          }
        }
        return str;
      });
    }
    promise = promise.then(() => new Promise((resolve, reject) => {
      if(initTable) {
        pages = [new Page(pageFile(fileFormat, 0), 0, pageSize, true)];
        resolve();
      }
      else {
        fs.readFile(manifestFile, (err, data) => {
          if(err) {
            reject(err);
            return;
          }
          var manifest = JSON.parse('' + data);
          pages = _.times(manifest.pages, i => new Page(pageFile(fileFormat, i), i, pageSize, false));
          resolve();
        });
      }
    }));
    
    function get(index) {
      return promise = promise.then(() => {
        var pageIndex = Math.floor(index / pageSize);
        if(pageIndex < 0 || pageIndex >= pages.length) throw new Error('no such element');
        return pages[pageIndex].get(index);
      });
    }
    function insert(value) {
      return promise = promise.then(() => {
        return Promise.all(pages.map(page => page.promise)).then(() => {
          //console.log('table.insert: '+JSON.stringify(value));
          for(var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if(page.capacity == 0) continue;
            return page.insert(value);
          }
          page = new Page(pageFile(fileFormat, pages.length), pages.length, pageSize, true);
          pages.push(page);
          page.insert(value);
        });
      });
    }
    function remove(index) {
      return promise = promise.then(() => {
        var pageIndex = Math.floor(index / pageSize);
        if(pageIndex < 0 || pageIndex >= pages.length) throw new Error('no such element');
        return pages[pageIndex].remove(index);
      });
    }
    function save() {
      return promise = promise.then(() => {
        fs.writeFile(manifestFile, JSON.stringify({
          pages: pages.length
        }), 'utf8', err => {
          if(err) {
            console.error(err);
          }
        });
        pages.forEach(page => page.save());
      });
    }
    Object.assign(this, {
      get,
      insert,
      remove,
      save
    });
  }
  
  This.loadCategories = () => promise = promise.then(() => new Promise((resolve, reject) => {
    fs.readFile('categories/categories.json', (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      var categories = JSON.parse('' + data);
      This.categories = categories;
      resolve(categories);
    });
  }));
  This.getCategory = i => {
    if(This.categories)
      promise = promise.then(() => This.categories);
    else
      This.loadCategories();
    promise = promise.then(categories => {
      return categories[i];
    });
  };
  
  This.loadBooks = () => promise = promise.then(() => new Promise((resolve, reject) => {
    fs.readFile('books/books.json', (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      var books = JSON.parse('' + data);
      This.books = books;
      resolve(books);
    });
  }));
  This.getBook = i => {
    var promise;
    if(This.books)
      promise = Promise.resolve(This.books);
    else
      promise = This.loadBooks();
    return promise.then(books => {
      return books[i];
    });
  };
  
  This.loadVersions = () => promise = promise.then(() => new Promise((resolve, reject) => {
    fs.readFile('versions/versions.json', (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      var versions = JSON.parse('' + data);
      This.versions = versions;
      resolve(versions);
    });
  }));
  This.getVersion = i => {
    var promise;
    if(This.versions)
      promise = Promise.resolve(This.versions);
    else
      promise = This.loadVersions();
    return promise.then(versions => {
      return versions[i];
    });
  };
  This.getVersionByKey = key => {
    var promise;
    if(This.versions)
      promise = Promise.resolve(This.versions);
    else
      promise = This.loadVersions();
    return promise.then(versions => {
      return versions.filter(v => v.key == key)[0];
    });
  };
  /*
  This.ProcessVersions = function ProcessMeta() {
    This.loadVersions().then(versions => {
      var newVersions = [];
      var domains = [];
      for(const key in versions) {
        let {name, code, domains: versionDomains} = versions[key];
        newVersions.push({name, key, code});
        for(const domainKey in versionDomains) {
          let {name: domainName, url, type} = versionDomains[domainKey];
          domains.push({
            name: domainName,
            url,
            type,
            //typeName: domainKey,
            version: newVersions.length - 1
          });
        }
      }
      fs.writeFile('versions/versions.json', JSON.stringify(newVersions), 'utf8', err => {
        if (err) console.error(err);
      });
      fs.writeFile('sources/sources.json', JSON.stringify(domains), 'utf8', err => {
        if (err) console.error(err);
      });
    });
  };
  //*/
  
  This.loadSources = () => promise = promise.then(() => new Promise((resolve, reject) => {
    fs.readFile('sources/sources.json', (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      var sources = JSON.parse('' + data);
      This.sources = sources;
      resolve(sources);
    });
  }));
  /*
  This.AddSourceIndices = function AddSourceIndices() {
    This.loadSources().then(sources => {
      sources = sources.map((source,i) => {
        let {
          name,
          url,
          type,
          version,
        } = source;
        return {
          id: i,
          name,
          url,
          type,
          version,
        };
      });
      fs.writeFile('sources/sources.json', JSON.stringify(sources), 'utf8', err => {
        if (err) console.error(err);
      });
    });
  };
  //*/
  This.getSource = i => {
    var promise;
    if(This.sources)
      promise = Promise.resolve(This.sources);
    else
      promise = This.loadSources();
    return promise.then(sources => {
      return sources[i];
    });
  };
  This.searchSources = (_version, _type) => {
    var promise;
    if(This.sources)
      promise = Promise.resolve([This.sources, _version, _type]);
    else
      promise = This.loadSources().then(sources => [sources, _version, _type]);
    if(_.isString(_version)) {
      promise = promise.then(([sources, version, type]) => {
        return db.getVersionByKey(version).then(V => [sources, V.id, type]);
      });
    }
    return promise.then(([sources, version, type]) => {
      //console.log(`searching by version: ${version}`);
      return sources.filter(s => {
        if(version != undefined && s.version != version) return false;
        if(type != undefined && s.type != type) return false;
        return true;
      });
    });
  };
  
  This.bookSources = new Table(
    'book-sources/book-sources.json',
    'book-sources/book-sources-page-%03i.json',
    100,
    false
  );
  promise = promise.then(() => This.bookSources.promis);
  This.ProcessManifest = (source) => {
    return This.getSource(source).then(source => new Promise((resolve,reject) => {
      //console.log('reading manifest `../${source.name}/manifest.json`');
      fs.readFile(`../${source.name}/manifest.json`, (err, data) => {
        if(err) {
          console.error(err);
          reject(err);
          return;
        }
        var manifest = JSON.parse('' + data);
        resolve(manifest);
      });
    })).then(manifest => {
      return Promise.all(manifest.arr.map(book => {
        let {
          index,
          path
        } = book;
        return This.bookSources.insert({
          source,
          book: index - 1,
          url: path
        });
      }));
    });
  };
  
  This.chapterSources = new Table(
    'chapter-sources/chapter-sources.json',
    'chapter-sources/chapter-sources-page-%05i.json',
    1000,
    false
  );
  This.ProcessBook = (source, book) => {
    return Promise.all([This.getSource(source), This.getBook(book)]).then(([source,book]) => new Promise((resolve,reject) => {
      //console.log('reading manifest `../${source.name}/manifest.json`');
      fs.readFile(`../${source.name}/books/${book.name.toLowerCase()}.json`, (err, data) => {
        if(err) {
          console.error(err);
          reject(err);
          return;
        }
        var manifest = JSON.parse('' + data);
        resolve(manifest);
      });
    })).then(bookData => {
      //console.log(book);
      //*
      return Promise.all(bookData.chapters.map(chapter => {
        let {
          path,
          number
        } = chapter;
        return This.chapterSources.insert({
          source,
          book,
          chapter: number - 1,
          url: path
        });
      }));
      //*/
    });
  };
  
  This.verses = new Table(
    'verses/verses.json',
    'verses/verses-page-%05i.json',
    1000,
    false
  );
  This.ProcessBook = (source, book) => {
    return Promise.all([This.getSource(source), This.getBook(book)]).then(([source,book]) => new Promise((resolve,reject) => {
      //console.log('reading manifest `../${source.name}/manifest.json`');
      fs.readFile(`../${source.name}/books/${book.name.toLowerCase()}.json`, (err, data) => {
        if(err) {
          console.error(err);
          reject(err);
          return;
        }
        var manifest = JSON.parse('' + data);
        resolve(manifest);
      });
    })).then(bookData => {
      //console.log(book);
      //*
      return Promise.all(bookData.chapters.map(chapter => {
        let {
          path,
          number
        } = chapter;
        return This.chapterSources.insert({
          source,
          book,
          chapter: number - 1,
          url: path
        });
      }));
      //*/
    });
  };
  
  This.save = function() {
    return Promise.all([
      This.bookSources.save(),
      This.chapterSources.save()
    ]);
  };
}

var db = new BibleDB();
//db.AddSourceIndices();
//db.loadVersions().then(versions => {
//  console.log(versions);
//});
//db.ProcessVersions();
if(false)
db.getSource(20).then(source => {
  console.log(source);
});
if(false)
db.searchSources('kjv', 0).then(sources => {
  //console.log(sources);
  db.ProcessManifest(sources[0].id).then(() => {
    db.save();
  });
});
if(false)
db.bookSources.get(65).then(bs => {
  console.log(bs);
});
if(false)
Promise.all(_.times(66, i => db.ProcessBook(20, i))).then(() => {
  db.save();
});
if(false)
db.chapterSources.get(854).then(cs => {
  console.log(cs);
});
/*
function pageFile(format, i) {
  return format.replace(/%(0| )?([1-9])?i/g, function(match, p1, p2) {
    if(false)
    console.log({
      match,
      p1,
      p2
    });
    var str = '' + i;
    if(p2 != undefined) {
      var width = parseInt(p2, 10);
      if(p1 == undefined) p1 = '0';
      while(str.length < width) {
        str = p1 + str;
      }
    }
    return str;
  });
}
console.log(pageFile('book-sources/book-sources-page-%03i.json', 2));
//*/