/* ===== CANVAS & PARTICLES ===== */
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

let particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0ff";
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== COUNTDOWN ===== */
const newYear = new Date("Jan 1, 2026 00:00:00").getTime();

const timer = setInterval(() => {
  const now = Date.now();
  const d = newYear - now;

  if (d <= 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "🎆 00 : 00 : 00 : 00 🎆";
    document.getElementById("title").innerText = "HAPPY NEW YEAR 2026";
    document.getElementById("subtitle").innerText = "Semoga semua harapan tercapai ✨";
    document.getElementById("title").classList.add("newyear");

    document.querySelectorAll("input, textarea, button").forEach(el => el.disabled = false);

    fireworksActive = true;
    setInterval(launchFirework, 900);
    animateFireworks();
    return;
  }

  days.innerText = Math.floor(d / (1000 * 60 * 60 * 24));
  hours.innerText = Math.floor((d / (1000 * 60 * 60)) % 24);
  minutes.innerText = Math.floor((d / (1000 * 60)) % 60);
  seconds.innerText = Math.floor((d / 1000) % 60);
}, 1000);

/* ===== SAVE WISH ===== */
function saveWish() {
  const name = nameInput.value.trim();
  const wish = wishInput.value.trim();
  if (!name || !wish) return alert("Isi dulu ✨");

  const data = JSON.parse(localStorage.getItem("wishes")) || [];
  data.push({ name, wish });
  localStorage.setItem("wishes", JSON.stringify(data));

  alert("Harapan tersimpan 🎆");
  nameInput.value = "";
  wishInput.value = "";
}

/* ===== ADMIN ===== */
function openAdmin() {
  if (prompt("Password admin:") === "admin2026") {
    wishList.style.display = "block";
    const data = JSON.parse(localStorage.getItem("wishes")) || [];
    wishList.innerHTML = "<h3>📜 Harapan Masuk</h3>";
    data.forEach((w, i) => {
      wishList.innerHTML += `<p>${i + 1}. <b>${w.name}</b>: ${w.wish}</p>`;
    });
  } else {
    alert("Akses ditolak ❌");
  }
}

const nameInput = document.getElementById("name");
const wishInput = document.getElementById("wish");
const wishList = document.getElementById("wishList");

/* ===== FIREWORKS ===== */
let fireworksActive = false;
let fireworks = [];

function launchFirework() {
  fireworks.push({
    x: Math.random() * canvas.width,
    y: canvas.height,
    targetY: Math.random() * canvas.height / 2,
    exploded: false,
    particles: []
  });
}

function heartPattern(x, y) {
  const p = [];
  for (let t = 0; t < Math.PI * 2; t += 0.2) {
    const r = 10 * (1 - Math.sin(t));
    p.push({
      x,
      y,
      dx: r * Math.cos(t) * 0.4,
      dy: -r * Math.sin(t) * 0.4,
      life: 80,
      color: "#f0f"
    });
  }
  return p;
}

function textPattern(x, y, text) {
  const p = [];
  ctx.font = "bold 50px Orbitron";
  ctx.fillText(text, x - 60, y);
  const data = ctx.getImageData(x - 100, y - 60, 200, 120).data;
  ctx.clearRect(x - 100, y - 60, 200, 120);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 150) {
      const px = x - 100 + (i / 4) % 200;
      const py = y - 60 + Math.floor(i / 4 / 200);
      p.push({
        x: px,
        y: py,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        life: 100,
        color: "#0ff"
      });
    }
  }
  return p;
}

function explode(fw) {
  fw.particles = Math.random() < 0.6
    ? heartPattern(fw.x, fw.y)
    : textPattern(fw.x, fw.y, "2026");
}

function animateFireworks() {
  if (!fireworksActive) return;

  fireworks.forEach((fw, i) => {
    if (!fw.exploded) {
      fw.y -= 5;
      ctx.fillStyle = "#fff";
      ctx.fillRect(fw.x, fw.y, 2, 2);
      if (fw.y <= fw.targetY) {
        fw.exploded = true;
        explode(fw);
      }
    } else {
      fw.particles.forEach((p, j) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        if (p.life <= 0) fw.particles.splice(j, 1);
      });
    }
    if (fw.exploded && fw.particles.length === 0) fireworks.splice(i, 1);
  });

  requestAnimationFrame(animateFireworks);
}