const fs = require("fs");

function SQL(dir, version, domain) {
  var promise;
  var sql = {
    books: []
  };
  function file(type, filename, data) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${dir}/${filename}.json`, (err, body) => {
        if(err) {
          console.error(err);
          reject();
          return;
        }
        
        var json = JSON.parse('' + body);
        
        var book, text;
        switch(type) {
          case 'manifest':
            text = json.arr.map(book => {
              let {
                path: url,
                index
              } = book;
              return `INSERT INTO version_book (url, book_index, source_id) SELECT '${url}', ${index}, S.id FROM source S, version V, domain D WHERE S.version_id = V.id AND S.domain_id = D.id AND V.ucode = '${version}' AND D.name = '${domain}';`;
            }).join('\n');
            fs.writeFile(`${dir}/manifest.sql`, text, 'utf8', err => {
              if(err) {
                console.error(err);
              }
            });
            sql.manifest = text;
            json.arr.forEach(book => {
              promise = promise.then(() => file('book', `books/${book.code}`));
            });
            break;
          case 'book':
            //console.log(`converting book ${filename}`);
            book = json.index;
            text = json.chapters.map(chapter => {
              let {
                path: url,
                number: index
              } = chapter;
              return `INSERT INTO version_chapter (index, url, book_id) SELECT ${index}, '${url}', B.id FROM version_book B, source S, version V, domain D WHERE B.source_id = S.id AND B.book_index = ${book} AND S.version_id = V.id AND S.domain_id = D.id AND V.ucode = '${version}' AND D.name = '${domain}';`;
            }).join('\n');
            fs.writeFile(`${dir}/${filename}.sql`, text, 'utf8', err => {
              if(err) {
                console.error(err);
              }
            });
            sql.books[book - 1] = {
              chapters: []
            };
            sql.books[book - 1].sql = text;
            json.chapters.forEach(chapter => {
              promise = promise.then(() => file('chapter', `chapters/${chapter.code}`, book));
            });
            break;
          case 'chapter':
            //console.log(`converting chapter ${filename}: version: ${version}, domain: ${domain}, book: ${data}, chapter: ${json.number}`);
            book = data;
            var chapter = json.number;
            text = json.verses.map(verse => {
              let {
                number: index,
                text,
                html
              } = verse;
              return `INSERT INTO version_verse (index, verse, html, chapter_id) SELECT ${index}, '${text.replace(/'/g, "''")}', '${html.replace(/'/g, "''")}', C.id FROM version_chapter C, version_book B, source S, version V, domain D WHERE C.book_id = B.id AND C.index = ${chapter} AND B.source_id = S.id AND B.book_index = ${book} AND S.version_id = V.id AND S.domain_id = D.id AND V.ucode = '${version}' AND D.name = '${domain}';`;
            }).join('\n');
            fs.writeFile(`${dir}/${filename}.sql`, text, 'utf8', err => {
              if(err) {
                console.error(err);
              }
            });
            sql.books[book - 1].chapters[chapter - 1] = {verses: json.verses.length, sql: text};
            if(book == 66 && chapter == 22) {
              var all = sql.manifest;
              all += '\n';
              var bk = sql.books.map(book => book.sql).join('\n\n');
              fs.writeFile(`${dir}/books.sql`, bk, 'utf8', err => {
                if(err) {
                  console.error(err);
                }
              });
              all += bk;
              all += '\n';
              var vs = sql.books.map(book => {
                return book.chapters.map(chapter => chapter.sql).join('\n\n');
              }).join('\n\n');
              fs.writeFile(`${dir}/verses.sql`, vs, 'utf8', err => {
                if(err) {
                  console.error(err);
                }
              });
              all +=vs;
              fs.writeFile(`${dir}/all.sql`, all, 'utf8', err => {
                if(err) {
                  console.error(err);
                }
              });
              vs = '';
              var vn = 0, fi = 0;
              sql.books.forEach(book => {
                book.chapters.forEach(chapter => {
                  let {
                    verses: count,
                    sql
                  } = chapter;
                  if(vn + count > 1000) {
                    fs.writeFile(`${dir}/verses-${fi < 10 ? '0' + fi : fi}.sql`, vs, 'utf8', err => {
                      if(err) {
                        console.error(err);
                      }
                    });
                    vs = '';
                    vn = 0;
                    fi++;
                  }
                  vs += (vs == '' ? '' : '\n\n') + sql;
                  vn += count;
                });
              });
              fs.writeFile(`${dir}/verses-${fi < 10 ? '0' + fi : fi}.sql`, vs, 'utf8', err => {
                if(err) {
                  console.error(err);
                }
              });
              sql.books.forEach((book, i) => {
                var out = book.chapters.map(chapter => chapter.sql).join('\n\n');
                fs.writeFile(`${dir}/verses-book-${i < 9 ? '0' + (i+1) : i+1}.sql`, out, 'utf8', err => {
                  if(err) {
                    console.error(err);
                  }
                });
              });
            }
            break;
        }
        resolve();
      });
    });
  }
  promise = file('manifest', 'manifest');
}

fs.writeFile('version-data.sql', `
CREATE TABLE version_book (
 id serial PRIMARY KEY,
 name text,
 url text NOT NULL,
 book_index integer REFERENCES book,
 source_id integer REFERENCES source
);

CREATE TABLE version_chapter (
 id serial PRIMARY KEY,
 index integer NOT NULL,
 url text,
 book_id integer REFERENCES book,
 source_id integer REFERENCES source
);

CREATE TABLE version_verse (
 id serial PRIMARY KEY,
 index integer NOT NULL,
 url text,
 verse text NOT NULL,
 html text,
 chapter_id integer REFERENCES book,
 source_id integer REFERENCES source
);
`, 'utf8', err => {
  if(err) {
    console.error(err);
  }
});

SQL('kjv.biblestudytools.com', 'kjv', 'biblestudytools');