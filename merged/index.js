/*
const {
  combineChapters
} = require("./load.js");

combineChapters(true, true, true).catch(err => {
  console.log(err);
});
*/

const {
  loadChapter
} = require("./bible.js");

loadChapter("exodus", 20).then(exodus20 => {
  //console.log(exodus);
  console.log(JSON.stringify(exodus20.verses[7], null, 2));
}, err => {
  console.log(err);
});