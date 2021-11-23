// 原文：https://github.com/shfshanyue/Daily-Question/issues/447

// jsonp 实现
function stringify (data) {
  const pairs = Object.entries(data)
  const qs = pairs.map(([k, v]) => {
    let noValue = false
    if (v === null || v === undefined || typeof v === 'object') {
      noValue = true
    }
    return `${encodeURIComponent(k)}=${noValue ? '' : encodeURIComponent(v)}`
  }).join('&')
  return qs
}

function jsonp ({ url, onData, params }) {
  const script = document.createElement('script')

  // 一、为了避免全局污染，使用一个随机函数名
  const cbFnName = `JSONP_PADDING_${Math.random().toString().slice(2)}`
  // 二、默认 callback 函数为 cbFnName
  script.src = `${url}?${stringify({ callback: cbFnName, ...params })}`
  // 三、使用 onData 作为 cbFnName 回调函数，接收数据
  window[cbFnName] = onData;

  document.body.appendChild(script)
}


// 服务端代码
const http = require('http')
const url = require('url')
const qs = require('querystring')

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url)
  const params = qs.parse(query)

  const data = { name: 'shanyue', id: params.id }

  if (params.callback) {
    
    /** 相当于
     * <script>cbFnName(data)</script>
     * 挂在到页面中，cbFnName 函数挂载在 window 下，此时执行该函数
     */
    str = `${params.callback}(${JSON.stringify(data)})`
    res.end(str)
  } else {
    res.end()
  }

})

server.listen(10010, () => console.log('Done'))


// 页面
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <script src="./index.js" type="text/javascript"></script>
  <script type="text/javascript">
  jsonp({
    url: 'http://localhost:10010',
    params: { id: 10000 },
    onData (data) {
      console.log('Data:', data)
    }
  })
  </script>
</body>
</html> 
*/