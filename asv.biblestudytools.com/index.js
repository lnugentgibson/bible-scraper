const {
  setFetchDelay,
  loadMeta,
  applyMetaToBookManifest,
  applyMetaToManifest,
  loadManifest,
  saveManifest,
  loadBookManifest,
  //addChapter,
  addAllChapters
} = require("./load.js");

setFetchDelay(100);

var promise = Promise.resolve();
promise = promise.then(() => loadManifest());
promise = promise.then(books => loadMeta().then(meta => {
  applyMetaToManifest(books, meta);
  return meta;
}).then(meta => {
  return {
    books,
    meta
  };
}).then(data => saveManifest(data.books).then(() => data)));
promise = promise.then(data => data.books.arr.reduce((chain, book) => chain.then(() => loadBookManifest(book).then(book => {
  applyMetaToBookManifest(book, data.meta);
  data[book.code] = book;
  return addAllChapters(book).then(() => data);
})), Promise.resolve()).then(() => data));