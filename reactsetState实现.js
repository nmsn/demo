//创建一个队列
const queue = [];
const renderQueue = [];

function setState(stateChange) {
  enqueueSetState(stateChange, this);
}

/**
 *该方法用于保存传过来的一个个state和其对应要更新的组件，但是并不更新
 *而是先放入该队列中等待操作
 */
function enqueueSetState(stateChange, component) {
  // 如果queue的长度是0，也就是在上次flush执行之后第一次往队列里添加
  // 在连续调用setState时只会在第一次执行，后面多次时queue.length > 0
  if (queue.length === 0) {
    // 会在所有同步任务完成后执行
    defer(flush);
  }

  queue.push({
    stateChange,
    component,
  });

  // 如果renderQueue里没有当前组件，则添加到队列中
  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component);
  }
}

function defer(fn) {
  return Promise.resolve().then(fn); // 模拟"异步"更新
  // return requestAnimationFrame( fn );
}

function flush() {
  let item;
  // 遍历
  while ((item = queue.shift())) {
    const { stateChange, component } = item;

    // 如果没有prevState，则将当前的state作为初始的prevState
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }

    // 如果stateChange是一个方法，也就是setState的第二种形式
    if (typeof stateChange === "function") {
      Object.assign(
        component.state,
        stateChange(component.prevState, component.props),
      );
    } else {
      // 如果stateChange是一个对象，则直接合并到setState中
      Object.assign(component.state, stateChange);
    }

    component.prevState = component.state;
  }

  // 渲染每一个组件
  while ((component = renderQueue.shift())) {
    renderComponent(component); // 调用render渲染组件
  }
}
