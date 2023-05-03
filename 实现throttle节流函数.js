// 函数节流的实现
// 时间戳版
function throttle(fn, delay) {
  let pre = Date.now();

  return function (...args) {
    let now = Date.now();

    if (now - pre > delay) {
      pre = Date.now();
      fn.apply(this, args);
    }
  };
}

// 定时器版
function throttle(fn, delay) {
  let timer = null;

  return function (args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    }
  };
}

// 立即执行

function throttle(fn, delay, imme) {
  let timer = null;

  return function (args) {
    if (!timer) {
      if (imme) {
        fn.apply(this, args);
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      }

      if (!imme) {
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
        }, delay);
      }
    }
  };
}
