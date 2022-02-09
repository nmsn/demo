class Iter {
  constructor(arr) {
    this[Symbol.iterator] = function* () {
      for (let i = 0; i < arr.length; i++) {
        yield arr[i];
      }
    };
  }
}

const iter = new Iter([1, 2, 3]);

for (let item of iter) {
  console.log(item);
}
