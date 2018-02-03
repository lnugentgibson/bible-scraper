const fs = require("fs");

var manifest;
var chapters = [];
var chapterCodes = {};

var loaders = {};
var maxChapters = 5;

function loadManifest() {
  return loaders.manifest ? loaders.manifest : loaders.manifest = new Promise((resolve, reject) => {
    if(manifest) {
      resolve(manifest);
      return;
    }
    fs.readFile("manifest.json", (err, body) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(manifest = JSON.parse("" + body));
    });
  });
}

function loadBookManifest(bookName) {
  bookName = bookName.toLowerCase().replace(/ /, "-");
  return loadManifest().then(() => loaders[bookName] ? loaders[bookName] : loaders[bookName] = new Promise((resolve, reject) => {
    if(manifest && manifest.names[bookName].manifest) {
      resolve(manifest[bookName].manifest);
      return;
    }
    fs.readFile(`books/${bookName}.json`, (err, body) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(manifest.names[bookName].manifest = JSON.parse("" + body));
    });
  }));
}

function loadChapter(bookName, chapterNumber) {
  bookName = bookName.toLowerCase().replace(/ /, "-");
  var code = bookName + "-" + ("000" + chapterNumber).substr(-3, 3);
  return loadManifest().then(() => loaders[code] ? loaders[code] : loaders[code] = new Promise((resolve, reject) => {
    if(chapterCodes[code] && chapterCodes[code].manifest) {
      resolve(chapterCodes[code].manifest);
      return;
    }
    fs.readFile(`chapters/${code}.json`, (err, body) => {
      if(err) {
        console.log(err);
        reject(err);
        return;
      }
      if(chapters.length >= maxChapters) {
        var chapter = chapters[0];
        delete loaders[chapter.code];
        delete chapterCodes[chapter.code];
        chapters.splice(0, 1);
        delete chapter.code;
        delete chapter.manifest;
      }
      var cm = {
        code,
        manifest: JSON.parse("" + body)
      };
      chapters.push(cm);
      chapterCodes[code] =cm;
      resolve(cm.manifest);
    });
  }));
}

module.exports = {
  loadManifest,
  loadBookManifest,
  loadChapter
};