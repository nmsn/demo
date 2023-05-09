/**
 * 1. 创建一个新的空对象
 * 2. 设置原型，将对象的原型设置为函数的 prototype 对象
 * 3. 让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
 * 4. 判断函数的返回类型，如果是值类型，返回创建的对象，如果是引用类型，就返回这个引用类型的对象
 */

function myNew(constructor, ...args) {
  // 判断参数是否是一个函数
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  }

  // 创建新对象,并继承构造方法的prototype属性, 这一步是为了把obj挂原型链上, 相当于obj.__proto__ = Foo.prototype
  const newObj = Object.create(constructor.prototype);
  // 执行构造方法, 并为其绑定新this, 这一步是为了让构造方法能进行this.name = name之类的操作, args是构造方法的入参, 因为这里用myNew模拟, 所以入参从myNew传入
  const result = constructor.apply(newObj, args);
  // 如果构造方法已经return了一个对象，那么就返回该对象，否则返回myNew创建的新对象（一般情况下，构造方法不会返回新实例，但使用者可以选择返回新实例来覆盖new创建的对象）
  return typeof result === "object" && result !== null ? result : newObj;
}
