// 函数节流的实现
// 时间戳版
function throttle(fn, delay) {
  let curTime = Date.now();

  return function () {
    let context = this,
      args = [...arguments],
      nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn.apply(context, args);
    }
  };
}

// 定时器版
function throttle(fun, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = [...arguments];
    if (!timeout) {
      timeout = setTimeout(() => {
        fun.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}
