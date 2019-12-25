// 1.双层for循环

function distinct(arr) {
  for (let i=0, len=arr.length; i<len; i++) {
      for (let j=i+1; j<len; j++) {
          if (arr[i] == arr[j]) {
              arr.splice(j, 1);
              // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
              len--;
              j--;
          }
      }
  }
  return arr;
}

// 2.Array.filter加indexOf

function distinct(a, b) {
  let arr = a.concat(b);
  return arr.filter((item, index)=> {
      return arr.indexOf(item) === index
  })
}

// 3.Array.sort() 加一行遍历冒泡(相邻元素去重)

function distinct(array) {
  var res = [];
  var sortedArray = array.concat().sort();
  var seen;
  for (var i = 0, len = sortedArray.length; i < len; i++) {
      // 如果是第一个元素或者相邻的元素不相同
      if (!i || seen !== sortedArray[i]) {
          res.push(sortedArray[i])
      }
      seen = sortedArray[i];
  }
  return res;
}


// 4.ES6中的Set去重

let unique = (a) => [...new Set(a)]

// 5.Object键值对

function distinct(array) {
  var obj = {};
  return array.filter(function(item, index, array){
      return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
  })
}
