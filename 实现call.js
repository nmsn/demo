Function.prototype.call = function (context) {
  var context = Object(context) || window;
  context.fn = this;

  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }

  var result = eval('context.fn(' + args +')');
  
  // ES6实现
  // for(var i = 1, len = arguments.length; i < len; i++) {
  //   args.push(arguments[i]);
  // }
  // var result = context.fn(...args);

  delete context.fn
  return result;
}

var obj = {
  value: 1
}

function bar(name, age) {
  console.log(this.value);
  return {
      value: this.value,
      name: name,
      age: age
  }
}

// bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));