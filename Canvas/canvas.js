
  const icon = new Image();
  icon.src = 'icon.png';
  icon.width = '50';
  icon.height = '50';
  const map = new Image();
  map.src = 'map.jpg';

  const canvas = document.getElementById('map');
  const ctx = canvas.getContext('2d');

  var raf;

  var ball = {
    x: 100, //x坐标
    y: 100, //y坐标
    vx: 5,
    vy: 2,
    radius: 25, //半径
    color: 'blue',
    draw: function() {
      ctx.beginPath();
      ctx.drawImage(icon, this.x, this.y, 50, 50);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      if (this.y + this.vy + this.radius*2 > canvas.height || this.y + this.vy < 0) {
        this.vy = -this.vy;
      }
      if (this.x + this.vx + this.radius*2 > canvas.width || this.x + this.vx < 0) {
        this.vx = -this.vx;
      }
    }
  };

  function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
    raf = window.requestAnimationFrame(draw);
  }

  // canvas.addEventListener('mouseover', function(e){
  //   raf = window.requestAnimationFrame(draw);
  // });

  // canvas.addEventListener('mouseout', function(e){
  //   window.cancelAnimationFrame(raf);
  // });

  const button = document.getElementsByTagName("button")[0];

  button.addEventListener('click', function(e){
    raf = window.requestAnimationFrame(draw);
  });

  ball.draw();