Function.prototype.bind2 = function(context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable",
    );
  }

  var self = this; // 调用函数
  var args = Array.prototype.slice.call(arguments, 1); // arguments类数组，不能直接使用slice方法

  var fNOP = function() {};

  var fBound = function() {
    var bindArgs = Array.prototype.slice.call(arguments);

    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs),
    );
  };
  
  // TODO 意义
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
