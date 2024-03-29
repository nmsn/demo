/** obj
 * obj 作为当前要验证的对象，obj[i] 作为对象的属性被验证
 * parent 作为累计的需要被验证的对象的数组，在递归中逐渐增加
 */

const isCycleObject = (obj, parent) => {
  const parentArr = parent || [obj];
  for (let i in obj) {
    if (typeof obj[i] === "object") {
      let flag = false;
      parentArr.forEach((pObj) => {
        if (pObj === obj[i]) {
          flag = true;
        }
      });
      if (flag) return true;

      //
      flag = isCycleObject(obj[i], [...parentArr, obj[i]]);
      if (flag) return true;
    }
  }
  return false;
};

const a = 1;
const b = { a };
const c = { b };
const o = { d: { a: 3 }, c };
o.c.b.aa = a;

console.log(isCycleObject(o));
