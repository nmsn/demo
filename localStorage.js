// 原文：https://juejin.cn/post/7030585901524713508

/**
 * localStorage 使用 UTF-16 DomString 储存 键 和 值，每个 字符 使用 2 个字节
 * 码点 > 0xFFFF(65535)，大于这个码点的是 4 个字节
 */

// 计算 UTF-16 字符串的字节数
function sizeofUtf16Bytes(str) {
  var total = 0,
    charCode,
    i,
    len;
  for (i = 0, len = str.length; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode <= 0xffff) {
      total += 2;
    } else {
      total += 4;
    }
  }
  return total;
}


// value 2 个字节的 value
const charTxt = "人";


// 10 * 1024 * 1024 = 1048760
let count = (10 * 1024 * 1024) / 2 - 8 / 2;
let content = new Array(count).fill(charTxt).join("");

// key 8 个字节的 key
const key = "aa🔴";

localStorage.clear();

try {
  // content + '1' 都会超限
  localStorage.setItem(key, content);
} catch (err) {
  console.log("err", err);
}

const sizeKey = sizeofUtf16Bytes(key);
const charSize = sizeofUtf16Bytes(charTxt);
const contentSize = sizeofUtf16Bytes(content);

// 8 2 5242876
console.log("key size:", sizeKey, charSize, content.length);
// 10485752 5242876
console.log("content size:", contentSize, content.length);
// 10485760 字节数 5242880 字符串长度
console.log("total size:", sizeKey + contentSize, content.length + key.length);

/**
 * 所以，说是10M的字节数，更为准确，也更容易让人理解。
 * 如果说5M，那其单位就是字符串的长度，而不是字符数。
*/


// ------

// 判断 键 本身占不占用空间

const charTxt = "a";
let count = (2.5 * 1024 * 1024);
let content = new Array(count).fill(charTxt).join("");
const key = new Array(count).fill(charTxt).join("");
localStorage.clear();
try {
    console.time("setItem")
    localStorage.setItem(key, content);
    console.timeEnd("setItem")
} catch (err) {
    console.log("err code:", err.code);
    console.log("err message:", err.message)
}

// 正常执行

const charTxt = "a";
let count = (2.5 * 1024 * 1024);

// content 额外 + 1
let content = new Array(count).fill(charTxt).join("") + 1;
const key = new Array(count).fill(charTxt).join("");
localStorage.clear();
try {
    console.time("setItem")
    localStorage.setItem(key, content);
    console.timeEnd("setItem")
} catch (err) {
    console.log("err code:", err.code);
    console.log("err message:", err.message)
}

// 失败

// <meta charset="UTF-8"></meta> 这和 localStorage 的存储没有半毛钱的关系