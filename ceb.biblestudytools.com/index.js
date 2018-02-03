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
promise = promise.then(() => loadManifest()).catch(err => {
  console.log("ERROR LOADING MANIFEST");
  console.log(err);
  process.exit(1);
});
promise = promise.then(books => loadMeta().catch(err => {
  console.log("ERROR LOADING META");
  console.log(err);
  process.exit(1);
}).then(meta => {
  applyMetaToManifest(books, meta);
  return meta;
}).catch(err => {
  console.log("ERROR APPLYING META");
  console.log(err);
  process.exit(1);
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