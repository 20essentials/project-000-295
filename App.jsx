import { useEffect, useRef } from "react";
import { css } from "@emotion/css";

const globalStyles = css`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
      "Helvetica Neue";
    -webkit-tap-highlight-color: transparent;
  }

  html {
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: white transparent;
  }

  body {
    height: 100dvh;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    background-color: #000;
    overflow: hidden;
  }
`;

const canvasStyle = css`
  border: 2px solid black;
  position: fixed;
  inset: 0;
`;

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let width = (canvas.width = document.documentElement.scrollWidth);
    let height = (canvas.height = document.documentElement.scrollHeight);
    const ctx = canvas.getContext("2d");
    let particles = [];

    const randomColor = () =>
      `rgb(${[...Array(3)].map(() => ~~(Math.random() * 255))})`;

    const resizeCanvas = () => {
      width = canvas.width = document.documentElement.scrollWidth;
      height = canvas.height = document.documentElement.scrollHeight;
    };

    class Particle {
      constructor(x, y, cpx1, cpy1, cpx2, cpy2, xEnd, yEnd) {
        this.initX = x;
        this.initY = y;
        this.cpx1 = cpx1;
        this.cpy1 = cpy1;
        this.cpx2 = cpx2;
        this.cpy2 = cpy2;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.t = Math.random(); // inicia en punto aleatorio para diversidad
      }

      update() {
        this.t += 0.01;
        if (this.t > 1) this.t = 0;

        const u = 1 - this.t;
        const { initX: x, initY: y, cpx1, cpy1, cpx2, cpy2, xEnd, yEnd } = this;

        this.x =
          u ** 3 * x +
          3 * u ** 2 * this.t * cpx1 +
          3 * u * this.t ** 2 * cpx2 +
          this.t ** 3 * xEnd;

        this.y =
          u ** 3 * y +
          3 * u ** 2 * this.t * cpy1 +
          3 * u * this.t ** 2 * cpy2 +
          this.t ** 3 * yEnd;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = randomColor();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const addParticles = () => {
      particles = [];
      for (let i = 0; i < 400; i++) {
        const x = ~~(Math.random() * width);
        const y = ~~(Math.random() * height);
        const cpx1 = ~~(Math.random() * width);
        const cpy1 = ~~(Math.random() * height);
        const cpx2 = ~~(Math.random() * width);
        const cpy2 = ~~(Math.random() * height);
        const xEnd = ~~(Math.random() * width);
        const yEnd = ~~(Math.random() * height);
        particles.push(new Particle(x, y, cpx1, cpy1, cpx2, cpy2, xEnd, yEnd));
      }
    };

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCanvas);
    };

    // Iniciar animación al montar
    addParticles();
    animateCanvas();

    // Redimensionar
    const onResize = () => {
      resizeCanvas();
      addParticles();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <canvas ref={canvasRef} className={canvasStyle}></canvas>
    </>
  );
}
