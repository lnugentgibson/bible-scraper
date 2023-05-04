const fs = require("fs");

//var oaStruct = require("./lib/oalpha-js-library/src/struct/trie.js");
const oaStruct = require("@oalpha/oa-struct");
require("@oalpha/oa-struct/btree");
require("@oalpha/oa-struct/trie");

const BTreeNode = oaStruct.get('btreeNode');
const TrieNode = oaStruct.get('trieNode');
const RadixTreeNode = oaStruct.get('radixTreeNode');

function Verse(version, book, chapter, verse, radix) {
  var tree = radix ? new RadixTree() : new Trie();
  var filename = `${version}/chapters/${book}-${('000' + chapter).slice(-3)}.json`;
  //console.log(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        console.error(err);
        reject(err);
        return;
      }
      var c = JSON.parse('' + data);
      var v = c.verses[verse - 1];
      //console.log(v.text);
      var regex = RegExp("[A-Za-z]([A-Za-z-]*[A-Za-z])?", 'g');
      var match;
      while ((match = regex.exec(v.text)) !== null) {
        //console.log(
        //  `Found ${match[0]} at ${match.index}. Next starts at ${regex.lastIndex}.`
        //);
        tree.add(match[0], {
          book,
          chapter,
          verse,
          index: match.index
        });
      }
      resolve(tree);
    });
  });
}

function Chapter(version, book, chapter, radix) {
  var tree = radix ? new RadixTree() : new Trie();
  var filename = `${version}/chapters/${book}-${('000' + chapter).slice(-3)}.json`;
  //console.log(filename);
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
        while ((match = regex.exec(v.text)) !== null) {
          //console.log(
          //  `Found ${match[0]} at ${match.index}. Next starts at ${regex.lastIndex}.`
          //);
          tree.add(match[0], {
            book,
            chapter,
            verse: v.number,
            index: match.index
          });
        }
      });
      resolve(tree);
    });
  });
}

function Book(version, book, Tree, blacklist) {
  let byWord = Tree.init({unique: true}),
    byId = [],
    //byId = BTreeNode.init({
    //  unique: true,
    //  comparator: 'difference',
    //  min: 1, max: 3
    //}),
    doubles = {}, triples = {};
  //console.log(JSON.stringify(tree, null, 2));
  let index = 0;
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
            //console.log(
            //  `Found ${match[0]} at ${match.index}. Next starts at ${regex.lastIndex}.`
            //);
            tokens.push({word: match[0], index: match.index});
          }
          tokens = tokens.map(({word, index: char_index}, i) => {
            if(RadixTreeNode.at(blacklist, word)) return;
            let entry = Tree.at(byWord, word), id;
            if(!entry) {
              id = index++;
              entry = {
                id,
                occurrences: [
                  {
                    book,
                    chapter: c.number,
                    verse: v.number,
                    word_index: i,
                    char_index
                  }
                ]
              };
              Tree.add(byWord, word, entry);
              byId[id] = {word, entry};
            }
            else {
              id = entry.id;
              entry.occurrences.push({
                book,
                chapter: c.number,
                verse: v.number,
                word_index: i,
                char_index
              });
            }
            return {word, id};
          });
          return;
          let T = tokens.length - 1;
          tokens.forEach((token, i) => {
            if(!token) return;
            let {id} = token;
            if(i > 0) {
              let p = tokens[i - 1];
              if(!p) return;
              let double = doubles[p.id];
              if(!double) double = doubles[p.id] = [];
              let ind = double.indexOf(id);
              if(ind < 0) {
                double.push(id);
                double.sort();
              }
            }
            if(false && i < T) {
              let n = tokens[i + 1];
              if(!n) return;
              let double = doubles[id];
              if(!double) double = doubles[id] = [];
              let ind = double.indexOf(n.id);
              if(ind < 0) {
                double.push(n.id);
                double.sort();
              }
            }
          });
        });
        resolve();
      });
    });
  }))).then(() => {
    //for(const keyval of Tree.inOrderGenerator(byWord)) {
    //  let entry = keyval.val;
    //  let id = entry.id;
    //  BTreeNode.add(byId, id, entry);
    //}
    //doubles = Object.keys(doubles).map(id => doubles[id].map(i => [parseInt(id, 10), i])).flat();
    return Promise.resolve({byWord, byId, size: index++/*, doubles, doubles_size: doubles.length*/});
  });
}

function printTree(tab, key, val, string) {
  //console.log(`printTree($node, '${c}')`)
  if (key == "_end") {
    console.log(tab + "leaves");
    val.forEach((leaf) => {
      console.log(tab + '  ' + JSON.stringify(leaf));
    });
  } else {
    console.log(tab + key + ": " + string);
    val.forEach(printTree.bind(null, tab + '  '));
  }
}
//Verse('kjv.biblestudytools.com', '1-samuel', 1, 1, true).then(tree => {
//  tree.forEach(printTree.bind(null, ''));
//});
//Chapter('kjv.biblestudytools.com', '1-samuel', 1, true).then(tree => {
//  //tree.forEach(printTree.bind(null, ''));
//  console.log(JSON.stringify(tree.toJSON(), null, 2));
//});
let radix = true;
let Tree = radix ? RadixTreeNode : TrieNode;
const blacklist = RadixTreeNode.init({unique: true});
[
  'a',
  'A',
  'an',
  'An',
  'and',
  'And',
  'of',
  'the',
  'The'
].forEach(w => {
  RadixTreeNode.add(blacklist, w, 1);
});
Book('kjv.biblestudytools.com', '1-samuel', Tree, blacklist).then(({byWord, byId, size, doubles, doubles_size}) => {
  console.log(size);
  console.log(doubles_size);
  //tree.forEach(printTree.bind(null, ''));
  let top = {
    tree: byWord.tree,
    children: {}
  }, topArr = [];
  if(byWord.val) {
    top.val = byWord.val;
    topArr.push('');
  }
  const entries1 = Object.entries(byWord.children);
  entries1.sort((a, b) => {
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return -1;
    return 0;
  });
  for(const [c1, st1] of entries1) {
    let St1 = top.children[c1] = {
      tree: st1.tree,
      children: {}
    };
    if(st1.val) {
      St1.val = st1.val;
      topArr.push(c1);
    }
    const entries2 = Object.entries(st1.children);
    entries2.sort((a, b) => {
      if(a[0] < b[0]) return -1;
      if(a[0] > b[0]) return -1;
      return 0;
    });
    for(const [c2, st2] of entries2) {
      if(st2.val) {
        St1.children[c2] = {
          tree: st2.tree,
          children: {},
          val: st2.val
        };
        topArr.push(c2);
      }
      fs.writeFile(`./concordance/1_samuel/byWord/subtree_${c1}${c2}.json`, JSON.stringify(Tree.toJSON(st2), null, 2), 'utf8', err => {
        if(err) console.error(err);
      });
    }
  }
  fs.writeFile(`./concordance/1_samuel/byWord/tree.json`, JSON.stringify(Tree.toJSON(top), null, 2), 'utf8', err => {
    if(err) console.error(err);
  });
  let arr = [];
  for(const {key} of RadixTreeNode.inOrderGenerator(byWord)) {
    arr.push(key);
  }
  fs.writeFile(`./concordance/1_samuel/byWord/arr.json`, JSON.stringify(arr, null, 2), 'utf8', err => {
    if(err) console.error(err);
  });
  return;
  let batch_size = 256, batch_index = 0;
  for(let batch_start = 0; batch_start < doubles_size; batch_start += batch_size) {
    let batch_end = Math.min(batch_start + batch_size, doubles_size);
    let ds = doubles.slice(batch_start, batch_end).map(([a, b]) => {
      a = byId[a].word;
      b = byId[b].word;
      return a + ' ' + b;
    });
    fs.writeFile(`./concordance/1_samuel/doubles/batch_${batch_index}.json`, JSON.stringify(ds, null, 2), 'utf8', err => {
      if(err) console.error(err);
    });
    batch_index++;
  }
});