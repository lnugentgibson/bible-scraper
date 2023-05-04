const fs = require("fs");

const BookData = [
  { "index": 1, "fullName": "The First Book of Moses Called Genesis", "name": "Genesis", "numChapters": 50, "numVerses": 1533, "category": "Law", "categoryIndex": 1 },
  { "index": 2, "fullName": "The Second Book of Moses Called Exodus", "name": "Exodus", "numChapters": 40, "numVerses": 1213, "category": "Law", "categoryIndex": 1 },
  { "index": 3, "fullName": "The Third Book of Moses Called Leviticus", "name": "Leviticus", "numChapters": 27, "numVerses": 859, "category": "Law", "categoryIndex": 1 },
  { "index": 4, "fullName": "The Fourth Book of Moses Called Numbers", "name": "Numbers", "numChapters": 36, "numVerses": 1288, "category": "Law", "categoryIndex": 1 },
  { "index": 5, "fullName": "The Fifth Book of Moses Called Deuteronomy", "name": "Deuteronomy", "numChapters": 34, "numVerses": 959, "category": "Law", "categoryIndex": 1 },
  { "index": 6, "fullName": "The Book of Joshua", "name": "Joshua", "numChapters": 24, "numVerses": 658, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 7, "fullName": "The Book of Judges", "name": "Judges", "numChapters": 21, "numVerses": 618, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 8, "fullName": "The Book of Ruth", "name": "Ruth", "numChapters": 4, "numVerses": 85, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 9, "fullName": "The First Book of Samuel", "name": "1-Samuel", "numChapters": 31, "numVerses": 810, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 10, "fullName": "The Second Book of Samuel", "name": "2-Samuel", "numChapters": 24, "numVerses": 695, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 11, "fullName": "The First Book of Kings", "name": "1-Kings", "numChapters": 22, "numVerses": 816, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 12, "fullName": "The Second Book of Kings", "name": "2-Kings", "numChapters": 25, "numVerses": 719, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 13, "fullName": "The First Book of Chronicles", "name": "1-Chronicles", "numChapters": 29, "numVerses": 942, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 14, "fullName": "The Second Book of Chronicles", "name": "2-Chronicles", "numChapters": 36, "numVerses": 822, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 15, "fullName": "The Book of Ezra", "name": "Ezra", "numChapters": 10, "numVerses": 280, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 16, "fullName": "The Book of Nehemiah", "name": "Nehemiah", "numChapters": 13, "numVerses": 406, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 17, "fullName": "The Book of Esther", "name": "Esther", "numChapters": 10, "numVerses": 167, "category": "Old Testament Narrative", "categoryIndex": 2 },
  { "index": 18, "fullName": "The Book of Job", "name": "Job", "numChapters": 42, "numVerses": 1070, "category": "Wisdom Literature", "categoryIndex": 3 },
  { "index": 19, "fullName": "The Book of Psalms", "name": "Psalms", "numChapters": 150, "numVerses": 2461, "category": "Wisdom Literature", "categoryIndex": 3 },
  { "index": 20, "fullName": "The Book of Proverbs", "name": "Proverbs", "numChapters": 31, "numVerses": 915, "category": "Wisdom Literature", "categoryIndex": 3 },
  { "index": 21, "fullName": "The Book of Ecclesiastes", "name": "Ecclesiastes", "numChapters": 12, "numVerses": 222, "category": "Wisdom Literature", "categoryIndex": 3 },
  { "index": 22, "fullName": "The Song of Songs (or Song of Solomon or Canticles)", "name": "Song-of-Solomon", "altName": "Song-of-Songs", "numChapters": 8, "numVerses": 117, "category": "Wisdom Literature", "categoryIndex": 3 },
  { "index": 23, "fullName": "The Book of Isaiah", "name": "Isaiah", "numChapters": 66, "numVerses": 1292, "category": "Major Prophets", "categoryIndex": 4 },
  { "index": 24, "fullName": "The Book of Jeremiah", "name": "Jeremiah", "numChapters": 52, "numVerses": 1364, "category": "Major Prophets", "categoryIndex": 4 },
  { "index": 25, "fullName": "The Book of Lamentations", "name": "Lamentations", "numChapters": 5, "numVerses": 154, "category": "Major Prophets", "categoryIndex": 4 },
  { "index": 26, "fullName": "The Book of Ezekiel", "name": "Ezekiel", "numChapters": 48, "numVerses": 1273, "category": "Major Prophets", "categoryIndex": 4 },
  { "index": 27, "fullName": "The Book of Daniel", "name": "Daniel", "numChapters": 12, "numVerses": 357, "category": "Major Prophets", "categoryIndex": 4 },
  { "index": 28, "fullName": "The Book of Hosea", "name": "Hosea", "numChapters": 14, "numVerses": 197, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 29, "fullName": "The Book of Joel", "name": "Joel", "numChapters": 3, "numVerses": 73, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 30, "fullName": "The Book of Amos", "name": "Amos", "numChapters": 9, "numVerses": 146, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 31, "fullName": "The Book of Obadiah", "name": "Obadiah", "numChapters": 1, "numVerses": 21, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 32, "fullName": "The Book of Jonah", "name": "Jonah", "numChapters": 4, "numVerses": 48, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 33, "fullName": "The Book of Micah", "name": "Micah", "numChapters": 7, "numVerses": 105, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 34, "fullName": "The Book of Nahum", "name": "Nahum", "numChapters": 3, "numVerses": 47, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 35, "fullName": "The Book of Habakkuk", "name": "Habakkuk", "numChapters": 3, "numVerses": 56, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 36, "fullName": "The Book of Zephaniah", "name": "Zephaniah", "numChapters": 3, "numVerses": 53, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 37, "fullName": "The Book of Haggai", "name": "Haggai", "numChapters": 2, "numVerses": 38, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 38, "fullName": "The Book of Zechariah", "name": "Zechariah", "numChapters": 14, "numVerses": 211, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 39, "fullName": "The Book of Malachi", "name": "Malachi", "numChapters": 4, "numVerses": 55, "category": "Minor Prophets", "categoryIndex": 5 },
  { "index": 40, "fullName": "The Gospel According to Matthew", "name": "Matthew", "numChapters": 28, "numVerses": 1071, "category": "New Testament Narrative", "categoryIndex": 6 },
  { "index": 41, "fullName": "The Gospel According to Mark", "name": "Mark", "numChapters": 16, "numVerses": 678, "category": "New Testament Narrative", "categoryIndex": 6 },
  { "index": 42, "fullName": "The Gospel According to Luke", "name": "Luke", "numChapters": 24, "numVerses": 1151, "category": "New Testament Narrative", "categoryIndex": 6 },
  { "index": 43, "fullName": "The Gospel According to John", "name": "John", "numChapters": 21, "numVerses": 879, "category": "New Testament Narrative", "categoryIndex": 6 },
  { "index": 44, "fullName": "The Acts of the Apostles", "name": "Acts", "numChapters": 28, "numVerses": 1007, "category": "New Testament Narrative", "categoryIndex": 6 },
  { "index": 45, "fullName": "The Epistle of Paul to the Romans", "name": "Romans", "numChapters": 16, "numVerses": 433, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 46, "fullName": "The First Epistle of Paul to the Corinthians", "name": "1-Corinthians", "numChapters": 16, "numVerses": 437, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 47, "fullName": "The Second Epistle of Paul to the Corinthians", "name": "2-Corinthians", "numChapters": 13, "numVerses": 257, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 48, "fullName": "The Epistle of Paul to the Galatians", "name": "Galatians", "numChapters": 6, "numVerses": 149, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 49, "fullName": "The Epistle of Paul to the Ephesians", "name": "Ephesians", "numChapters": 6, "numVerses": 155, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 50, "fullName": "The Epistle of Paul to the Philippians", "name": "Philippians", "numChapters": 4, "numVerses": 104, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 51, "fullName": "The Epistle of Paul to the Colossians", "name": "Colossians", "numChapters": 4, "numVerses": 95, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 52, "fullName": "The First Epistle of Paul to the Thessalonians", "name": "1-Thessalonians", "numChapters": 5, "numVerses": 89, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 53, "fullName": "The Second Epistle of Paul to the Thessalonians", "name": "2-Thessalonians", "numChapters": 3, "numVerses": 47, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 54, "fullName": "The First Epistle of Paul to Timothy", "name": "1-Timothy", "numChapters": 6, "numVerses": 113, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 55, "fullName": "The Second Epistle of Paul to Timothy", "name": "2-Timothy", "numChapters": 4, "numVerses": 83, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 56, "fullName": "The Epistle of Paul to Titus", "name": "Titus", "numChapters": 3, "numVerses": 46, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 57, "fullName": "The Epistle of Paul to Philemon", "name": "Philemon", "numChapters": 1, "numVerses": 25, "category": "Pauline Epistles", "categoryIndex": 7 },
  { "index": 58, "fullName": "The Epistle to the Hebrews", "name": "Hebrews", "numChapters": 13, "numVerses": 303, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 59, "fullName": "The General Epistle of James", "name": "James", "numChapters": 5, "numVerses": 108, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 60, "fullName": "The First Epistle of Peter", "name": "1-Peter", "numChapters": 5, "numVerses": 105, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 61, "fullName": "The Second Epistle of Peter", "name": "2-Peter", "numChapters": 3, "numVerses": 61, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 62, "fullName": "The First Epistle of John", "name": "1-John", "numChapters": 5, "numVerses": 105, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 63, "fullName": "The Second Epistle of John", "name": "2-John", "numChapters": 1, "numVerses": 13, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 64, "fullName": "The Third Epistle of John", "name": "3-John", "numChapters": 1, "numVerses": 14, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 65, "fullName": "The Epistle of Jude", "name": "Jude", "numChapters": 1, "numVerses": 25, "category": "General Epistles", "categoryIndex": 8 },
  { "index": 66, "fullName": "The Book of Revelation (or The Apocalypse of John)", "name": "Revelation", "numChapters": 22, "numVerses": 404, "category": "Apocalyptic Epistle", "categoryIndex": 9 }
];

var CategoryData = [];
BookData.forEach(book => {
  let {
    category,
    categoryIndex
  } = book;
  if (!CategoryData[categoryIndex - 1]) {
    CategoryData[categoryIndex - 1] = {
      index: categoryIndex,
      name: category,
    };
  }
});

fs.writeFile('categories.json', JSON.stringify(CategoryData, null, 2), 'utf8', err => {
  if (err) {
    console.error(err);
  }
});

fs.writeFile('books.rb', CategoryData.map(book => {
  let {
    index,
    name
  } = book;
  return `${name.toLowerCase().replace(/ /g, '_')} = Category.create(category_index: ${index}, name: '${name}')`;
}).join('\n') + '\n\n' + BookData.map(book => {
  let {
    index,
    fullName,
    name,
    numChapters,
    numVerses,
    category
  } = book;
  return `Book.create(book_index: ${index}, full_name: '${fullName}', name: '${name}', chapters: ${numChapters}, verses: ${numVerses.replace(/,/g, '')}, category_id: ${category.toLowerCase().replace(/ /g, '_')}.id)`;
}).join('\n'), 'utf8', err => {
  if (err) {
    console.error(err);
  }
});

var categoryInsert = CategoryData.map(book => {
  let {
    index,
    name
  } = book;
  return `INSERT INTO book_category VALUES(${index}, '${name}');`;
}).join('\n');

var bookInsert = BookData.map(book => {
  let {
    index,
    fullName,
    name,
    numChapters,
    numVerses,
    categoryIndex
  } = book;
  return `INSERT INTO book VALUES(${index}, '${name}', '${fullName}', ${numChapters}, ${numVerses.replace(/,/g, '')}, ${categoryIndex});`;
}).join('\n');

fs.writeFile('books.sql', `
CREATE TABLE book_category (
 index integer PRIMARY KEY CHECK (index > 0),
 name text NOT NULL
);

${categoryInsert}

CREATE TABLE book (
 index integer PRIMARY KEY CHECK (index > 0),
 name text UNIQUE NOT NULL,
 full_name text
 chapters integer,
 verses integer,
 category_id integer REFERENCES book_category
);

${bookInsert}
`, 'utf8', err => {
  if (err) {
    console.error(err);
  }
});
