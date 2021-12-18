function sumBigNumber(a, b) {
  let res = "";
  let temp = 0;

  // 将两个字符串转化为数组，用来计算每一位
  a = a.split("");
  b = b.split("");

  while (a.length || b.length || temp) {
    temp += ~~a.pop() + ~~b.pop();

    // 计算进位
    res = (temp % 10) + res;

    // 判断当前位是否大于9，也就是是否会进位，若是则将temp赋值为true，因为在加法运算中，true会自动隐式转化为1，以便于下一次相加
    temp = temp > 9;
  }
  return res.replace(/^0+/, "");
}

/**
 * ～ 按位取反
 *
 * ～(5.5) // -6
 * ~(-6) // 5
 * ~~(5.5) // 5 same as Math.floor()
 * ～～（-5.5）// -5
 */
