/**
 *
 * 概念：
 * 是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，
 * 并且返回接受余下的参数而且返回结果的新函数的技术
 *
 * 好处：
 * 1. 参数复用，或者说是固定参数，避免重复传参
 * 2. 提前返回，或者说是提前确认，避免重复判断
 * 3. 延迟执行
 */

function trueCurrying(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  }

  // 参数不足时返回一个接收另外参数的函数
  return function (...args2) {
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
  return function (...args) {
    // currying 包裹之后返回一个新函数，接收参数为 ...args
    return args.length >= length // 新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度
      ? fn.apply(this, args) // 满足要求，执行 fn 函数，传入新函数的参数
      : currying(fn.bind(this, ...args), length - args.length); // 不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度
  };
}

// ES6 写法
function curry(fn, ...args) {
  return (...callbackArgs) => {
    const currentArgs = [...args, ...callbackArgs];
    return callbackArgs.length === 0 || currentArgs.length === fn.length
      ? fn(...currentArgs)
      : curry(fn, ...currentArgs);
  };
}

/**
 * https://github.com/yygmind/blog/issues/37
 */

// 柯里化实例
const phoneReg = /^1[3-9]\d{9}$/;

function _checkPhone(reg, phone) {
  return reg.test(phone);
}

console.log(_checkPhone(phoneReg, 19956526362));



const checkPhone = curry(_checkPhone)(phoneReg); 
// 这样我们就复用了验证手机的正则，这就是复用参数，或者说是固定参数
checkPhone(19956526362);
checkPhone(16956526362);



function doSomething1(reg, phone, callback) {
  reg.test(phone) && callback();
}

function doSomething2(reg, phone, callback) {
  reg.test(phone) && callback();
}

doSomething1(phoneReg, 19956526362, callback1);
doSomething2(phoneReg, 19956526362, callback2);

// 既然是对同一个号码做判断，我们当然可以先将判断结果保存下来，这样就不用每次都做判断了
function _doSomething(reg, phone, callback) {
  reg.test(phone) && callback();
}

const doSomething = curry(_doSomething)(19956526362); // 这里就是提前返回电话号码是否正确了
doSomething(callback1); // 这里就是延迟执行
doSomething(callback2);
