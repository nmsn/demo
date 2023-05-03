function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer); //先清除定时器
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 立即执行版
function debounce(fn, delay, immediate) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    // timer 后续一直存在，clearTimeout 只是清理了定时器，timer 的值还在
    if (immediate && !timer) {
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        // 这一句加了，表示执行过后，再次执行时还会立即执行一次
        // 不加就是立即执行整个过程中只有一次
        // timer = null
        fn.apply(this, args);
      }, delay);
    }
  };
}
