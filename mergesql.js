const fs = require("fs");

function SQL(dir, version, domain) {
  var sql = '';
  
  fs.readFile(`${dir}/manifest.json`, (err, body) => {
    if(err) {
      console.error(err);
      return;
    }
    
    var json = JSON.parse('' + body);
    
    
  });
}