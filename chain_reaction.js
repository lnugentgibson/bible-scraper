let pairs = [
  ['Father', 'Abraham'],
  ['Jesus', 'Wept'],
  ['New', 'Earth'],
  ['New', 'Heaven'],
  ['Heaven', 'Sent'],
  ['Made', 'New'],
  ['Forbidden', 'Fruit'],
  ['Fire', 'Brimstone'],
  ['Golden', 'Calf'],
  ['Scape', 'Goat'],
  ['Sheep', 'Clothing'],
  ['Biblical', 'Proportions'],
  ['Milk', 'Honey'],
  ['Land', 'Scape'],
  ['Promised', 'Land'],
  ['Holy', 'Father'],
  ['Baby', 'Jesus'],
  ['Strange', 'Fire'],
  ['Extra', 'Mile'],
  ['Sour', 'Grapes'],
  ['Brother', 'Keeper'],
  ['Bread', 'Alone'],
  ['Living', 'Water'],
  ['Bread', 'Life'],
  ['Eternal', 'Life'],
  ['Flesh', 'Blood'],
  ['Blood', 'Red'],
  ['Filthy', 'Rags'],
  ['Skin', 'Bones'],
  ['Writing', 'Wall'],
  ['Feet', 'Clay'],
  ['Broken', 'Heart'],
  ['Baptism', 'Fire'],
  ['Salt', 'Earth'],
  ['Straight', 'Narrow'],
  ['Narrow', 'Path'],
  ['Narrow', 'Way'],
  ['House', 'Divided'],
  ['Father', 'House'],
  ['Move', 'Mountains'],
  ['Eleventh', 'Hour'],
  ['Many', 'Called'],
  ['Few', 'Chosen'],
  ['Kiss', 'Death'],
  ['Wash', 'Hands'],
  ['Wits', 'End'],
  ['End', 'Earth'],
  ['Spare', 'Rod'],
  ['Spoil', 'Child'],
  ['Pride', 'Fall'],
  ['Nothing', 'New'],
  ['Little', 'Bird'],
  ['Four', 'Corners'],
  ['Rise', 'Shine'],
  ['Good', 'Samaritan'],
  ['Samaritan', 'Woman'],
  ['Little', 'Faith'],
  ['First', 'Stone'],
  ['Seek', 'First'],
  ['Set', 'Free'],
  ['Holy', 'Ghost'],
  ['Holy', 'Spirit'],
  ['Spirit', 'Truth'],
  ['Water', 'Life'],
  ['Letter', 'Law'],
  ['Ten', 'Commandments'],
  ['Twelve', 'Tribes'],
  ['Twelve', 'Disciples'],
  ['Labour', 'Love'],
  ['Good', 'Fight'],
  ['Good', 'Shepherd'],
  ['Alpha', 'Omega'],
  ['Arch', 'Angel'],
  ['Goat', 'Horn'],
  ['Red', 'Blood'],
  ['Woman', 'Well'],
  ['Life', 'Abundant'],
  ['Horn', 'Altar'],
  ['Mount', 'Gilboa'],
  ['Mount', 'Ephraim'],
  ['Mount', 'Bethel'],
  ['Son', 'David'],
  ['One', 'Another'],
  ['Other', 'Gods'],
  ['One', 'Another'],
  ['Lord', 'Forbid'],
  ['Lord', 'Save'],
  ['Lord', 'Give'],
  ['Lord', 'Deliver'],
  ['Lord', 'Judge'],
  ['Judge', 'Not'],
  ['Lord', 'Saith'],
  ['Lord', 'Commanded'],
  ['Time', 'Appointed'],
  ['Make', 'Haste'],
  ['Fret', 'Not'],
  ['Not', 'Forsake'],
  ['Not', 'Lie'],
  ['Not', 'Fail'],
  ['Fail', 'Not'],
  ['Fail', 'You'],
  ['Not', 'Afraid'],
  ['You', 'Alone'],
  ['Heart', 'Fail'],
  ['Broken', 'Heart'],
  ['Heart', 'Rejoice'],
  ['Heart', 'Tremble'],
  ['Heart', 'Fail'],
  ['Heart', 'Grieved'],
  ['Grieved', 'Spirit'],
  ['Ten', 'Days'],
  ['Ten', 'Years'],
  ['Ten', 'Thousand'],
  ['Thousand', 'Years'],
  ['Thousand', 'Men'],
  ['Upon', 'Israel'],
  ['King', 'David'],
  ['King', 'Saul'],
  ['Young', 'David'],
  ['Upon', 'Camel'],
  ['Soul', 'Live'],
  ['Child', 'David'],
  ['Child', 'Samuel'],
  ['Glory', 'Depart'],
  ['Days', 'After'],
  ['Days', 'Appointed'],
  ['Appointed', 'Time'],
  ['Days', 'Gone'],
  ['Will', 'Come'],
  ['Pass', 'Over'],
  ['Before', 'God'],
  ['Spirit', 'Depart'],
  ['Take', 'Strength'],
  ['Take', 'Heed'],
  ['Have', 'Mercy'],
  ['Strong', 'Drink'],
  ['God', 'Save'],
  ['Israel', 'Rejoice'],
  ['Find', 'Grace'],
  ['Find', 'Favor'],
  ['Seek', 'Find'],
  ['More', 'Abundant'],
  ['Samuel', 'Spake'],
  ['Good', 'Report'],
  ['Good', 'Days'],
  ['Three', 'Hundred'],
  ['Three', 'Thousand'],
  ['Three', 'Days'],
  ['Three', 'Years'],
  ['Three', 'Nights'],
  ['Three', 'Men'],
  ['Three', 'Loaves'],
  ['Loaves', 'Fish'],
  ['Take', 'Over'],
  ['Over', 'Israel'],
  //['Over', 'Thousand'],
  ['None', 'Beside'],
  ['Holy', 'God'],
  ['Mighty', 'Men'],
  ['Mighty', 'God'],
  ['Seven', 'Days'],
  ['Killed', 'Many'],
  ['Many', 'Days'],
  ['Many', 'Years'],
  ['Killed', 'Thousand'],
  ['Wax', 'Cold'],
  ['Bee', 'Wax'],
  ['Honey', 'Bee'],
  ['Annointed', 'King'],
  ['Appointed', 'King'],
  ['People', 'Follow'],
  ['Peculiar', 'People'],
  ['People', 'Answered'],
  ['Struck', 'Down'],
  ['Burnt', 'Offering'],
  ['Father', 'Calf'],
  ['Sodden', 'Flesh'],
  ['Burnt', 'Incense'],
  ['Great', 'Delight'],
  ['Delight', 'Lord'],
  ['Great', 'Riches'],
  ['Great', 'Evil'],
  ['Evil', 'Deed'],
  ['Great', 'Name'],
  ['Name', 'Above'],
  ['Evil', 'Spirit'],
  ['Against', 'Israel'],
  ['Left', 'Right'],
  ['Nothing', 'Left'],
  ['Thousand', 'Horses'],
  ['Thousand', 'Sheep'],
];

let forward = {}, backward = {};

pairs.forEach(([a, b]) => {
  let sub = forward[a];
  if(!sub) sub = forward[a] = {};
  sub[b] = true;
  sub = backward[b];
  if(!sub) sub = backward[b] = {};
  sub[a] = true;
});
if(false)
console.log(JSON.stringify(forward, null, 2));

let roots = Object.keys(forward).map(word => ({
  word,
  path: [word],
  children: {}
})), paths = [], leaves = roots.map(v => v);

let updated = 1000, it = 0;
while(updated > 0 && it < 10000) {
  let u = 0;
  let new_leaves = [];
  leaves.forEach(leaf => {
    let edges = forward[leaf.word];
    let a = false;
    if(edges)
    Object.keys(edges).forEach(dst => {
      let i = leaf.path.indexOf(dst);
      if(i > 0) return;
      u++;
      a = true;
      let new_leaf = {
        word: dst,
        path: leaf.path.concat(dst),
        children: {},
        paren: leaf
      };
      leaf.children[dst] = new_leaf;
      if(i < 0)
        new_leaves.push(new_leaf);
    });
    if(!a) paths.push(leaf);
  });
  updated = u;
  leaves = new_leaves;
}
//if(false)
paths = paths.filter(p => p.path.length > 2);
let byLength = {};
paths.forEach(p => {
  let arr = byLength[p.path.length];
  if(!arr) arr = byLength[p.path.length] = [];
  arr.push(p.path);
});
console.log(JSON.stringify({
  count: paths.length,
  byLength,
  paths: paths.map(p => p.path)
}, null, 2));