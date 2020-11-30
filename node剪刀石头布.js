const action = process.argv[process.argv.length -1];

if (!['剪刀', '布', '石头'].includes(action)) {
  console.log('输入错误信息');
  return;
}
console.log(`你：${action}`);

const random = Math.random() * 3;

let computerAction;

if (random < 1) {
  computerAction = '剪刀';
} else if (random < 2) {
  computerAction = '布';
} else {
  computerAction = '石头';
}

console.log(`电脑：${computerAction}`);

if (action === computerAction) {
  console.log('平局');
} else if (
  action === '剪刀' && computerAction === '布' ||
  action === '布' && computerAction === '石头' ||
  action === '石头' && computerAction === '剪刀'
) {
  console.log('胜利');
} else {
  console.log('失败');
}