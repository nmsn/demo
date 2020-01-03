class Dep {
  // 初始化
  constructor() {
    this.subscribers = new Set();
  }

  // 订阅update函数列表
  depend() {
    if (activeUpdate) {  
      this.subscribers.add(activeUpdate);
    }
  }

  // 所有update函数重新运行
  notify() {
    this.subscribers.forEach(sub => sub());
  }
}

function observe(obj) {
  // 迭代对象的所有属性
  // 并使用Object.defineProperty()转换成getter/setters
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key];

    // 每个属性分配一个Dep实例
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      // getter负责注册订阅者
      get() {
        dep.depend();
        return internalValue;
      },

      // setter负责通知改变
      set(newVal) {
        const changed = internalValue !== newVal;
        internalValue = newVal;

        // 触发后重新计算
        if (changed) {
          dep.notify();
        }
      },
    });
  });
  return obj;
}

let activeUpdate = null;

function autorun(update) {
  // 包裹update函数到"wrappedUpdate"函数中，
  // "wrappedUpdate"函数执行时注册和注销自身
  const wrappedUpdate = () => {
    activeUpdate = wrappedUpdate;
    update();
    activeUpdate = null;
  };
  wrappedUpdate();
}
