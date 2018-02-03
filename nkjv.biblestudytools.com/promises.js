var promise = Promise.resolve();
promise = promise.then(() => {
  //throw new Error("err");
  return 235;
});
promise = promise.catch(() => {
  return 568;
});
promise.then(i => {
  console.log(i);
});