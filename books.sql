
CREATE TABLE book_category (
 index integer PRIMARY KEY CHECK (index > 0),
 name text NOT NULL
);

INSERT INTO book_category VALUES(1, 'Law');
INSERT INTO book_category VALUES(2, 'Old Testament Narrative');
INSERT INTO book_category VALUES(3, 'Wisdom Literature');
INSERT INTO book_category VALUES(4, 'Major Prophets');
INSERT INTO book_category VALUES(5, 'Minor Prophets');
INSERT INTO book_category VALUES(6, 'New Testament Narrative');
INSERT INTO book_category VALUES(7, 'Pauline Epistles');
INSERT INTO book_category VALUES(8, 'General Epistles');
INSERT INTO book_category VALUES(9, 'Apocalyptic Epistle');

CREATE TABLE book (
 index integer PRIMARY KEY CHECK (index > 0),
 name text UNIQUE NOT NULL,
 full_name text,
 chapters integer,
 verses integer,
 category_id integer REFERENCES book_category
);

INSERT INTO book VALUES(1, 'Genesis', 'The First Book of Moses Called Genesis', 50, 1533, 1);
INSERT INTO book VALUES(2, 'Exodus', 'The Second Book of Moses Called Exodus', 40, 1213, 1);
INSERT INTO book VALUES(3, 'Leviticus', 'The Third Book of Moses Called Leviticus', 27, 859, 1);
INSERT INTO book VALUES(4, 'Numbers', 'The Fourth Book of Moses Called Numbers', 36, 1288, 1);
INSERT INTO book VALUES(5, 'Deuteronomy', 'The Fifth Book of Moses Called Deuteronomy', 34, 959, 1);
INSERT INTO book VALUES(6, 'Joshua', 'The Book of Joshua', 24, 658, 2);
INSERT INTO book VALUES(7, 'Judges', 'The Book of Judges', 21, 618, 2);
INSERT INTO book VALUES(8, 'Ruth', 'The Book of Ruth', 4, 85, 2);
INSERT INTO book VALUES(9, '1-Samuel', 'The First Book of Samuel', 31, 810, 2);
INSERT INTO book VALUES(10, '2-Samuel', 'The Second Book of Samuel', 24, 695, 2);
INSERT INTO book VALUES(11, '1-Kings', 'The First Book of Kings', 22, 816, 2);
INSERT INTO book VALUES(12, '2-Kings', 'The Second Book of Kings', 25, 719, 2);
INSERT INTO book VALUES(13, '1-Chronicles', 'The First Book of Chronicles', 29, 942, 2);
INSERT INTO book VALUES(14, '2-Chronicles', 'The Second Book of Chronicles', 36, 822, 2);
INSERT INTO book VALUES(15, 'Ezra', 'The Book of Ezra', 10, 280, 2);
INSERT INTO book VALUES(16, 'Nehemiah', 'The Book of Nehemiah', 13, 406, 2);
INSERT INTO book VALUES(17, 'Esther', 'The Book of Esther', 10, 167, 2);
INSERT INTO book VALUES(18, 'Job', 'The Book of Job', 42, 1070, 3);
INSERT INTO book VALUES(19, 'Psalms', 'The Book of Psalms', 150, 2461, 3);
INSERT INTO book VALUES(20, 'Proverbs', 'The Book of Proverbs', 31, 915, 3);
INSERT INTO book VALUES(21, 'Ecclesiastes', 'The Book of Ecclesiastes', 12, 222, 3);
INSERT INTO book VALUES(22, 'Song-of-Solomon', 'The Song of Songs (or Song of Solomon or Canticles)', 8, 117, 3);
INSERT INTO book VALUES(23, 'Isaiah', 'The Book of Isaiah', 66, 1292, 4);
INSERT INTO book VALUES(24, 'Jeremiah', 'The Book of Jeremiah', 52, 1364, 4);
INSERT INTO book VALUES(25, 'Lamentations', 'The Book of Lamentations', 5, 154, 4);
INSERT INTO book VALUES(26, 'Ezekiel', 'The Book of Ezekiel', 48, 1273, 4);
INSERT INTO book VALUES(27, 'Daniel', 'The Book of Daniel', 12, 357, 4);
INSERT INTO book VALUES(28, 'Hosea', 'The Book of Hosea', 14, 197, 5);
INSERT INTO book VALUES(29, 'Joel', 'The Book of Joel', 3, 73, 5);
INSERT INTO book VALUES(30, 'Amos', 'The Book of Amos', 9, 146, 5);
INSERT INTO book VALUES(31, 'Obadiah', 'The Book of Obadiah', 1, 21, 5);
INSERT INTO book VALUES(32, 'Jonah', 'The Book of Jonah', 4, 48, 5);
INSERT INTO book VALUES(33, 'Micah', 'The Book of Micah', 7, 105, 5);
INSERT INTO book VALUES(34, 'Nahum', 'The Book of Nahum', 3, 47, 5);
INSERT INTO book VALUES(35, 'Habakkuk', 'The Book of Habakkuk', 3, 56, 5);
INSERT INTO book VALUES(36, 'Zephaniah', 'The Book of Zephaniah', 3, 53, 5);
INSERT INTO book VALUES(37, 'Haggai', 'The Book of Haggai', 2, 38, 5);
INSERT INTO book VALUES(38, 'Zechariah', 'The Book of Zechariah', 14, 211, 5);
INSERT INTO book VALUES(39, 'Malachi', 'The Book of Malachi', 4, 55, 5);
INSERT INTO book VALUES(40, 'Matthew', 'The Gospel According to Matthew', 28, 1071, 6);
INSERT INTO book VALUES(41, 'Mark', 'The Gospel According to Mark', 16, 678, 6);
INSERT INTO book VALUES(42, 'Luke', 'The Gospel According to Luke', 24, 1151, 6);
INSERT INTO book VALUES(43, 'John', 'The Gospel According to John', 21, 879, 6);
INSERT INTO book VALUES(44, 'Acts', 'The Acts of the Apostles', 28, 1007, 6);
INSERT INTO book VALUES(45, 'Romans', 'The Epistle of Paul to the Romans', 16, 433, 7);
INSERT INTO book VALUES(46, '1-Corinthians', 'The First Epistle of Paul to the Corinthians', 16, 437, 7);
INSERT INTO book VALUES(47, '2-Corinthians', 'The Second Epistle of Paul to the Corinthians', 13, 257, 7);
INSERT INTO book VALUES(48, 'Galatians', 'The Epistle of Paul to the Galatians', 6, 149, 7);
INSERT INTO book VALUES(49, 'Ephesians', 'The Epistle of Paul to the Ephesians', 6, 155, 7);
INSERT INTO book VALUES(50, 'Philippians', 'The Epistle of Paul to the Philippians', 4, 104, 7);
INSERT INTO book VALUES(51, 'Colossians', 'The Epistle of Paul to the Colossians', 4, 95, 7);
INSERT INTO book VALUES(52, '1-Thessalonians', 'The First Epistle of Paul to the Thessalonians', 5, 89, 7);
INSERT INTO book VALUES(53, '2-Thessalonians', 'The Second Epistle of Paul to the Thessalonians', 3, 47, 7);
INSERT INTO book VALUES(54, '1-Timothy', 'The First Epistle of Paul to Timothy', 6, 113, 7);
INSERT INTO book VALUES(55, '2-Timothy', 'The Second Epistle of Paul to Timothy', 4, 83, 7);
INSERT INTO book VALUES(56, 'Titus', 'The Epistle of Paul to Titus', 3, 46, 7);
INSERT INTO book VALUES(57, 'Philemon', 'The Epistle of Paul to Philemon', 1, 25, 7);
INSERT INTO book VALUES(58, 'Hebrews', 'The Epistle to the Hebrews', 13, 303, 8);
INSERT INTO book VALUES(59, 'James', 'The General Epistle of James', 5, 108, 8);
INSERT INTO book VALUES(60, '1-Peter', 'The First Epistle of Peter', 5, 105, 8);
INSERT INTO book VALUES(61, '2-Peter', 'The Second Epistle of Peter', 3, 61, 8);
INSERT INTO book VALUES(62, '1-John', 'The First Epistle of John', 5, 105, 8);
INSERT INTO book VALUES(63, '2-John', 'The Second Epistle of John', 1, 13, 8);
INSERT INTO book VALUES(64, '3-John', 'The Third Epistle of John', 1, 14, 8);
INSERT INTO book VALUES(65, 'Jude', 'The Epistle of Jude', 1, 25, 8);
INSERT INTO book VALUES(66, 'Revelation', 'The Book of Revelation (or The Apocalypse of John)', 22, 404, 9);
