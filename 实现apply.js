Function.prototype.apply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
    
    // ES6实现
    // for (var i = 0, len = arr.length; i < len; i++) {
    //   args.push(arr[i]);
    // }
    // result = context.fn(...args);
  }

  delete context.fn;
  return result;
};
