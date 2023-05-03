Function.prototype.newCall = function (obj, ...args) {
  const context = obj || window;

  context.fn = this;

  const result = context.fn(...args);

  delete context.fn;

  return result;
};

var obj = {
  value: 1,
};

function bar(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age,
  };
}


console.log(bar.newCall(obj, "kevin", 18));
