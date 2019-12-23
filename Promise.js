function Promi(executor) {
  let _this = this;
  _this.$$status = "pending";
  _this.failCallBack = undefined;
  _this.successCallback = undefined;
  _this.error = undefined;
  executor(resolve.bind(_this), reject.bind(_this));
  function resolve(params) {
    if (_this.$$status === "pending") {
      _this.$$status = "success";
      _this.successCallback(params);
    }
  }
  function reject(params) {
    if (_this.$$status === "pending") {
      _this.$$status = "fail";
      _this.failCallBack(params);
    }
  }
}

Promi.prototype.then = function(full, fail) {
  this.successCallback = full;
  this.failCallBack = fail;
};

// 测试代码
new Promi(function(res, rej) {
  setTimeout(_ => res("成功"), 30);
}).then(res => console.log(res));
