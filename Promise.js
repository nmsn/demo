class MyPromise {
  constructor(exec) {
    this.value = null;
    this.state = "pending";
    this.resolveList = [];
    this.rejectList = [];

    try {
      exec(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }

  _resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.resolveList.forEach((func) => func(value));
    }
  }

  _reject(value) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.value = value;
      this.rejectList.forEach((func) => func(value));
    }
  }

  then(onFulfilled, onRejected) {
    typeof onFulfilled !== "function" ? (onFulfilled = (value) => value) : null;
    typeof onRejected !== "function"
      ? (onRejected = (reason) => {
          throw new Error(reason instanceof Error ? reason.message : reason);
        })
      : null;

    return new MyPromise((resolve, reject) => {
      const fulfilledFn = (value) => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = onFulfilled(value);
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };

      // reject同理
      const rejectedFn = (error) => {
        try {
          let x = onRejected(error);
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };

      switch (this.state) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case "pending":
          this.resolveList.push(fulfilledFn);
          this.rejectList.push(rejectedFn);
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case "fulfilled":
          fulfilledFn(this.value); // this._value是上一个then回调return的值(见完整版代码)
          break;
        case "rejected":
          rejectedFn(this.value);
          break;
      }
    });
  }

  catch(rejectFn) {
    return this.then(undefined, rejectFn);
  }

  //finally方法
  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value), //执行回调,并returnvalue传递给后面的then
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        }) //reject同理
    );
  }

  //静态的resolve方法
  static resolve(value) {
    if (value instanceof MyPromise) return value; //根据规范, 如果参数是Promise实例, 直接return这个实例
    return new MyPromise((resolve) => resolve(value));
  }

  //静态的reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  //静态的all方法
  static all(promiseArr) {
    let index = 0;
    let result = [];
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        //Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(p).then(
          (val) => {
            index++;
            result[i] = val;
            if (index === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  //静态的race方法
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(
          //Promise.resolve(p)用于处理传入值不为Promise的情况
          (value) => {
            resolve(value); //注意这个resolve是上边new MyPromise的
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  }
}

export default MyPromise;
