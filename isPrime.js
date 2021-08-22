// 素数/质数判断
function isPrime(num) {
  if (num <= 3) {
    return num > 1
  }else {
    let sq = Math.sqrt(num)
    for (let i = 2; i <= sq; i++) {
     if (num%i === 0) {
       return false
     }
    }
    return true
  }
}