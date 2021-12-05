Function.prototype.apply = function (context, arr) {
  if (typeof this !== "function") {
    console.error("type error");
  }
  const context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
  }

  delete context.fn;
  return result;
};
