// forEach 循环, for 循环同理
function queue1(arr) {
  var sequence = Promise.resolve();
  arr.forEach(function (item) {
    sequence = sequence.then(item);
  });
  return sequence;
}

// async/await
async function queue2(arr) {
  let res = null;
  for (let promise of arr) {
    // forEach 只支持处理同步代码，此处 使用 for...of 是因为 for...of 是使用迭代器的方式遍历
    res = await promise(res);
  }
  return await res;
}

// reduce
function queue3(myPromises) {
  myPromises.reduce(
    (previousPromise, nextPromise) =>
      previousPromise.then((res) => nextPromise(res)),
    Promise.resolve(),
  );
}

const a = b = c = (x = 0) => {
  return new Promise((res, rej) => {
    console.log(x);
    res(x + 1);
  });
};

queue3([a, b, c]);
