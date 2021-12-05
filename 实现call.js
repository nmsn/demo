Function.prototype.call = function (context) {
  if (typeof this !== "function") {
    console.error("type error");
  }
  const context = Object(context) || window;
  context.fn = this;

  const args = [...arguments].slice(1);
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

// bar.call2(null); // 2

console.log(bar.call2(obj, "kevin", 18));
