(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((w * h) / 18000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.4,
        baseR: 0.4 + Math.random() * 1.4,
        alpha: 0.15 + Math.random() * 0.45,
        speed: 0.0008 + Math.random() * 0.0015,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() * 0.001;

    for (const s of stars) {
      // slowly shrink then grow back in a gentle cycle
      const pulse = 0.55 + 0.45 * Math.sin(t * s.speed * 60 + s.phase);
      const radius = s.baseR * pulse;

      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30, 30, 30, ${s.alpha * pulse})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  resize();
  createStars();
  draw();
})();
