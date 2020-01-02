function trueCurrying(fn, ...args) {

  if (args.length >= fn.length) {

      return fn(...args)

  }

  // 参数不足时返回一个接收另外参数的函数
  return function (...args2) {

      return trueCurrying(fn, ...args, ...args2)

  }
}

/* 作者：沃趣葫芦娃
 * 链接：https://juejin.im/post/5af13664f265da0ba266efcf
 * 来源：掘金
 * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
*/