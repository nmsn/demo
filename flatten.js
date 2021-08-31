function flatten(list, depth = 1) {
  if (depth === 0) return list;
  return list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b, depth - 1) : b),
    [],
  );
}

const a = flatten([1, 2, 3, [4, [5, 6]]]);
const b = flatten([1, 2, 3, [4, [5, 6]]], 2);

console.log(a, b);
