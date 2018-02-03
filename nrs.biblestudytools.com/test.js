const { URLOpt } = require("./load.js");

console.log(URLOpt({
  protocol: "https",
  username: "lgib",
  password: "pa$$",
  host: "www.kingjamesbibleonline.org",
  port: 1234,
  path: ["dir","sub"],
  query: {
    say: "something",
    too: "awesome"
  },
  hash: "section"
}));
