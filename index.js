const {
  setFetchDelay,
  scrapeDomain
} = require("./load.js");
const versions = require("./versions");

setFetchDelay(100);

/*
Object.keys(versions).reduce((chain, vcode, vi) => {
  var version = versions[vcode];
  console.log(`${vi}: ${vcode}`);
  console.log(version);
  return Object.keys(version.domains).reduce((subchain, dcode) => {
    var domain = version.domains[dcode];
    console.log(`${vi}: ${vcode}`);
    console.log(domain);
    return subchain.then(() => scrapeDomain(domain));
  }, chain);
}, Promise.resolve());
*/
scrapeDomain(versions.aa.domains.biblestudytools);