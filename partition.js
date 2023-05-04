const fs = require("fs");

//var oaStruct = require("./lib/oalpha-js-library/src/struct/trie.js");
const oaStruct = require("@oalpha/oa-struct");
require("@oalpha/oa-struct/trie");

const RadixTreeNode = oaStruct.get('radixTreeNode');

const partitions = [
  'article',
  'male',
  'female',
  'person',
  'place',
  'properNoun',
  'animal',
  'other',
];

function Partition(version, book, partition) {
  var filename = `${version}/books/${book}.json`;
  //console.log(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve(JSON.parse('' + data));
    });
  }).then(b => Promise.all(b.chapters.map(c => {
    var filename = `${version}/chapters/${book}-${('000' + c.number).slice(-3)}.json`;
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
        if(err) {
          console.error(err);
          reject(err);
          return;
        }
        var c = JSON.parse('' + data);
        c.verses.forEach(v => {
          var regex = RegExp("[A-Za-z]([A-Za-z-]*[A-Za-z])?", 'g');
          var match;
          let tokens = [];
          while ((match = regex.exec(v.text)) !== null) {
            const word = match[0];
            tokens.push({word, index: match.index});
            if(!partitions.some(key => {
              return RadixTreeNode.at(partition[key], word);
            })) {
              RadixTreeNode.add(partition.pending, word, true);
            }
          }
        });
        resolve();
      });
    });
  })));
}

const partition = {};
partitions.forEach(key => {
  partition[key] = RadixTreeNode.init({unique: true});
});
partition.pending = RadixTreeNode.init({unique: true});

//[
//  'a',
//  'A',
//  'an',
//  'An',
//  'and',
//  'And',
//  'of',
//  'the',
//  'The'
//].forEach(w => {
//  RadixTreeNode.add(partition.article, w, true);
//});

Promise.all(partitions.map(key => new Promise((resolve, reject) => {
  fs.readFile(`./partition/${key}.json`, (err, body) => {
    if(err) {
      console.error(err);
      reject(err);
      return;
    }
    JSON.parse('' + body).forEach(w => {
      RadixTreeNode.add(partition[key], w, true);
    });
  });
})));
Partition('kjv.biblestudytools.com', '1-samuel', partition).then(() => {
  partitions.forEach(key => {
    const tree = partition[key];
    //fs.writeFile(`./partition/${key}_tree.json`, JSON.stringify(RadixTreeNode.toJSON(tree), null, 2), 'utf8', err => {
    //  if(err) console.error(err);
    //});
    let arr = [];
    for(const {key} of RadixTreeNode.inOrderGenerator(tree)) {
      arr.push(key);
    }
    fs.writeFile(`./partition/${key}.json`, JSON.stringify(arr, null, 2), 'utf8', err => {
      if(err) console.error(err);
    });
  });
  let arr = [];
  for(const {key} of RadixTreeNode.inOrderGenerator(partition.pending)) {
    arr.push(key);
  }
  fs.writeFile(`./partition/pending.json`, JSON.stringify(arr, null, 2), 'utf8', err => {
    if(err) console.error(err);
  });
});