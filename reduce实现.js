const reduce = (list, fn, ...init) => {
  let next = init.length ? init[0] : list[0];
  for (let i = init.length ? 0 : 1; i < list.length; i++) {
    next = fn(next, list[i], i);
  }
  return next;
};

// => 55
const a = reduce([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (x, y) => x + y);

// => 155
const b = reduce([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (x, y) => x + y, 100);

// => NaN
const c = reduce([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (x, y) => x + y, undefined);

console.log(a, b, c);
