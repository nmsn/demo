function delay(func, seconds, ...args) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Promise.resolve(func(...args)).then(resolve);
    }, seconds);
  });
}

console.log(new Date());
delay(
  (str) => {
    console.log(str, new Date());
  },
  3000,
  "test string",
)
  .then((o) => console.log(o))
  .catch((e) => {
    console.log("error", e);
  });
