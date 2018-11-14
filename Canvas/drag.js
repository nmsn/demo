var obj = document.querySelector("span");
var text = document.querySelector(".text");
obj.addEventListener('touchstart', function(event) {
      event.preventDefault();
    // 如果这个元素的位置内只有一个手指的话
    if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    // 把元素放在手指所在的位置 
    var disX=touch.pageX-obj.offsetLeft;
    var disY=touch.pageY-obj.offsetTop;
    var box=document.querySelector(".box");
    var width= box.clientWidth-obj.offsetWidth;
      obj.addEventListener('touchmove',move);
      function move(event){
        var touch2=event.targetTouches[0];
        var l=touch2.pageX-disX;
        var t=touch2.pageY-disY;
        if(l<0){
            l=0;
        };
        if(l>width){
            l=width;
        };
        if(t<0){
            t=0;
        };
        if(t>0){
            t=0;
        };
        obj.style.left=l+'px';
        obj.style.top=t+'px';
        text.innerHTML = (l/width).toFixed(1);
    };
      obj.addEventListener('touchend',chend);
      function chend(event){
          obj.removeEventListener('touchmove',move);
          obj.removeEventListener('touchend',chend);
      };
    };
    }, false);