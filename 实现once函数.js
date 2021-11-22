/** 实现一个 once 函数，记忆返回结果只执行一次 */

/** 原文：https://github.com/shfshanyue/Daily-Question/issues/406 */
function once(f) {
  let result;
  let revoked = false;

  return (...args) => {
    if (revoked) {
      return result;
    }
    const r = f(...args);
    revoked = true;
    result = r;
    return r;
  };
}
