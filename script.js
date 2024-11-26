const canvas = document.querySelector('canvas');
let width = (canvas.width = document.documentElement.scrollWidth);
let height = (canvas.height = document.documentElement.scrollHeight);
const ctx = canvas.getContext('2d');
let particles = [];

const randomColor = () =>
  `rgb(${[...Array(3)].map(_ => ~~(Math.random() * 255))})`;

const resizeCanvas = () => {
  width = canvas.width = document.documentElement.scrollWidth;
  height = canvas.height = document.documentElement.scrollHeight;
};

class Particles {
  constructor(x, y, cpx1, cpy1, cpx2, cpy2, xEnd, yEnd) {
    this.x = x;
    this.y = y;
    this.cpx1 = cpx1;
    this.cpy1 = cpy1;
    this.cpx2 = cpx2;
    this.cpy2 = cpy2;
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.t = 0; 
  }

  update() {
    this.t += 0.01;

    if (this.t > 1) {
      this.t = 0;
    }
    let u = 1 - this.t;

    this.x =
      u ** 3 * this.x +
      3 * u ** 2 * this.t * this.cpx1 +
      3 * u * this.t ** 2 * this.cpx2 +
      this.t ** 3 * this.xEnd;

    this.y =
      u ** 3 * this.y +
      3 * u ** 2 * this.t * this.cpy1 +
      3 * u * this.t ** 2 * this.cpy2 +
      this.t ** 3 * this.yEnd;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = randomColor();
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

function addParticles() {
  particles = [];

  for (let i = 0; i < 400; i++) {
    let x = ~~(Math.random() * width);
    let y = ~~(Math.random() * height);
    let cpx1 = ~~(Math.random() * width);
    let cpy1 = ~~(Math.random() * height);
    let cpx2 = ~~(Math.random() * width);
    let cpy2 = ~~(Math.random() * height);
    let xEnd = ~~(Math.random() * width);
    let yEnd = ~~(Math.random() * height);
    particles.push(new Particles(x, y, cpx1, cpy1, cpx2, cpy2, xEnd, yEnd));
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach(particle => {
    particle.draw();
    particle.update();
  });

  requestAnimationFrame(animateCanvas);
}

document.addEventListener('DOMContentLoaded', e => {
  addParticles();
  animateCanvas();

  window.addEventListener('resize', () => {
    resizeCanvas()
    animateCanvas();
    addParticles()
  });
});
