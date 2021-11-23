/** 原文： https://github.com/shfshanyue/Daily-Question/issues/443
 * 如何实现一个 sample 函数，从数组中随机取一个元素
 */

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
