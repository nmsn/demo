// compose 会首先利用“...”运算符将入参收敛为数组格式
export default function compose(...funcs) {
  // 处理数组为空的边界情况
  if (funcs.length === 0) {
    return arg => arg
  }

  // 若只有一个函数，也就谈不上组合，直接返回
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 若有多个函数，那么调用 reduce 方法来实现函数的组合
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 核心处理逻辑为

function compose(...fns) {
  /** 
   * 此时是从右向左执行的顺序
   * 
   * 如果需要倒置顺序 调换 a b 函数的执行顺序
   *  */ 
  fns.reduce( (a, b) => (...args) => a(b(...args)));
}