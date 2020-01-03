function trueCurrying(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  }

  // 参数不足时返回一个接收另外参数的函数
  return function(...args2) {
    return trueCurrying(fn, ...args, ...args2);
  };
}

/** 作者：沃趣葫芦娃
 * 链接：https://juejin.im/post/5af13664f265da0ba266efcf
 * 来源：掘金
 * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */

function currying(fn, length) {
  length = length || fn.length; // 第一次调用获取函数 fn 参数的长度，后续调用获取 fn 剩余参数的长度
  return function(...args) {
    // currying 包裹之后返回一个新函数，接收参数为 ...args
    return args.length >= length // 新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度
      ? fn.apply(this, args) // 满足要求，执行 fn 函数，传入新函数的参数
      : currying(fn.bind(this, ...args), length - args.length); // 不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度
  };
}

/**
 * https://github.com/yygmind/blog/issues/37
 */