// 递归

let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
flatten(arr); //  [1, 2, 3, 4，5]

// reduce

let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]

// 扩展运算符实现

let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]

// split 和 toString

let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.toString().split(",");
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]

// ES6 flat

let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]

// 正则和 JSON 方法

let arr = [1, [2, [3, [4, 5]]], 6];
function flatten(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, "");
  str = "[" + str + "]";
  return JSON.parse(str);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
