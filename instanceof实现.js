function myInstanceof(target, origin) {
  // 非object直接返回false
  if (typeof target !== "object" || target === null) return false;

  let proto = Object.getPrototypeOf(target);
  while (proto) {
    if (proto === origin.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// https://juejin.cn/post/6844903988924514318
