// XMlHttpRequest

const request = new XMLHttpRequest(); // 新建XMLHttpRequest对象

request.onreadystatechange = function () {
  // 状态发生变化时，函数被回调
  if (request.readyState == 4) {
    // 成功完成
    // 判断响应结果:
    if (request.status == 200) {
      // 成功，通过responseText拿到响应的文本
      console.log(request.responseText);
    } else {
      // 失败，根据响应码判断失败原因:
      console.log(request.status);
    }
  }
};

// 发送请求
// open的参数：
// 一：请求方法，包括get/post等
// 二：请求地址
// 三：表示是否异步请求，若为false则是同步请求，会阻塞进程
request.open("GET", "/api/categories", true);
request.send();



// PromiseAjax
const ajax = function({ method, url, params, contentType }) {
  const xhr = new XMLHttpRequest();
  
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });

  const promise = new Promise(function(resolve, reject) {

    try {
      xhr.open(method, url, false);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
      xhr.send(formData);
    } catch (e) {
      reject(e);
    }
  });

  return promise;
};