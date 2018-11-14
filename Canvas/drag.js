var obj = document.querySelector("#map");
var container = document.querySelector("#container");

const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

obj.addEventListener('touchstart', function(event) {
    event.preventDefault();
    // 如果这个元素的位置内只有一个手指的话
    if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    // 把元素放在手指所在的位置 
    var disX = touch.pageX - obj.offsetLeft; // 点击点和点击物体边距离差值x
    var disY = touch.pageY - obj.offsetTop; // 点击点和点击物体边距离差值y

    obj.addEventListener('touchmove',move);

    function move(event){
      var touch2 = event.targetTouches[0];
      var left = touch2.pageX - disX;
      var top = touch2.pageY - disY;
      var objWidth = obj.offsetWidth;
      var objHeight = obj.offsetHeight;
      if(left > 0){
          left = 0;
      };
      if(left + objWidth < containerWidth){
          left = containerWidth - objWidth;
      };
      if(top > 0){
          top = 0;
      };
      if(top + objHeight < containerHeight){
          top = containerHeight - objHeight;
      };
      obj.style.left = left + 'px';
      obj.style.top = top + 'px';
    };

    obj.addEventListener('touchend',chend);

    function chend(event){
      obj.removeEventListener('touchmove',move);
      obj.removeEventListener('touchend',chend);
    };
  };
}, false);