(function() {
  'use strict';

  // === 配置 ===
  var PARTICLE_COUNT = 20;
  var PARTICLE_MAX_SIZE = 4;
  var PARTICLE_MIN_SIZE = 2;
  var SPEED = 0.15;
  var CONNECT_DIST = 100;
  var FPS = 30;
  var GRID_SPACING = 60;
  var GRID_OPACITY = 0.04;

  var canvas, ctx, particles, width, height, mouse, gridOffset;

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');
    mouse = { x: -9999, y: -9999 };
    gridOffset = 0;

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', function() {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7
      });
    }
  }

  function drawGrid() {
    gridOffset = (gridOffset + 0.05) % GRID_SPACING;

    ctx.save();
    var isDark = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDark
      ? 'rgba(255,255,255,' + GRID_OPACITY + ')'
      : 'rgba(0,0,0,' + GRID_OPACITY + ')';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (var x = gridOffset; x < width; x += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (var y = gridOffset; y < height; y += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawParticles() {
    var isDark = document.documentElement.classList.contains('dark');

    // Update particle positions
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx * p.speed;
      p.y += p.vy * p.speed;

      // Wrap around
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }

    // Draw connections
    ctx.save();
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.strokeStyle = isDark
            ? 'rgba(139, 140, 247, ' + alpha + ')'
            : 'rgba(94, 92, 230, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Draw particles
    var time = Date.now() / 1000;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var glow = 0.5 + 0.5 * Math.sin(time * 0.5 + p.phase);

      ctx.save();
      // Glow
      var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      if (isDark) {
        gradient.addColorStop(0, 'rgba(139, 140, 247, ' + (0.3 * glow) + ')');
        gradient.addColorStop(1, 'rgba(139, 140, 247, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(94, 92, 230, ' + (0.2 * glow) + ')');
        gradient.addColorStop(1, 'rgba(94, 92, 230, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = isDark
        ? 'rgba(139, 140, 247, ' + (0.4 + 0.3 * glow) + ')'
        : 'rgba(94, 92, 230, ' + (0.3 + 0.2 * glow) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.7 + 0.3 * glow), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  var lastTick = 0;
  var tickInterval = 1000 / FPS;

  function animate(timestamp) {
    requestAnimationFrame(animate);

    var elapsed = timestamp - lastTick;
    if (elapsed < tickInterval) return;
    lastTick = timestamp - (elapsed % tickInterval);

    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
