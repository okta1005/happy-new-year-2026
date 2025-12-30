/* ===== BACKGROUND PARTICLES ===== */
const canvas = document.getElementById("bg");
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

function animateBg() {
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
  requestAnimationFrame(animateBg);
}
animateBg();

/* ===== ELEMENTS ===== */
const nameInput = document.getElementById("name");
const wishInput = document.getElementById("wish");
const sendBtn = document.getElementById("sendBtn");
const afterSend = document.getElementById("afterSend");
const wishList = document.getElementById("wishList");

/* ===== TIME ===== */
const newYear = new Date(Date.now () + 10000).getTime();
const submitted = localStorage.getItem("submitted");

/* ===== LOCK FORM IF ALREADY SUBMIT ===== */
if (submitted) {
  nameInput.disabled = true;
  wishInput.disabled = true;
  sendBtn.disabled = true;
}

/* ===== COUNTDOWN ===== */
const timer = setInterval(() => {
  const now = Date.now();
  const d = newYear - now;

  if (d <= 0) {
    clearInterval(timer);
    document.getElementById("title").innerText = "HAPPY NEW YEAR 2026";
    document.getElementById("subtitle").innerText = "Semoga semua harapan tercapai ✨";

    if (!submitted) {
      nameInput.disabled = false;
      wishInput.disabled = false;
      sendBtn.disabled = false;
    }
    return;
  }

  days.innerText = Math.floor(d / (1000 * 60 * 60 * 24));
  hours.innerText = Math.floor((d / (1000 * 60 * 60)) % 24);
  minutes.innerText = Math.floor((d / (1000 * 60)) % 60);
  seconds.innerText = Math.floor((d / 1000) % 60);
}, 1000);

/* ===== SAVE WISH (1x ONLY) ===== */
sendBtn.onclick = () => {
  const name = nameInput.value.trim();
  const wish = wishInput.value.trim();

  if (!name || !wish) {
    alert("Isi dulu ✨");
    return;
  }

  const old = JSON.parse(localStorage.getItem("wishes")) || [];

  old.push({
    name: name,
    wish: wish,
    time: new Date().toISOString()
  });

  localStorage.setItem("wishes", JSON.stringify(old));
  localStorage.setItem("submitted", "true");

  nameInput.disabled = true;
  wishInput.disabled = true;
  sendBtn.disabled = true;

  afterSend.classList.remove("hidden");
};

/* ===== ADMIN (ANTI UNDEFINED) ===== */
function openAdmin() {
  if (prompt("Password admin:") !== "admin2026") {
    alert("Akses ditolak ❌");
    return;
  }

  const data = JSON.parse(localStorage.getItem("wishes")) || [];
  wishList.style.display = "block";
  wishList.innerHTML = "<h3>📜 Harapan Masuk</h3>";

  if (data.length === 0) {
    wishList.innerHTML += "<p>(Belum ada data)</p>";
    return;
  }

  data.forEach((w, i) => {
    if (!w.name || !w.wish) return; // ⛔ skip data rusak
    wishList.innerHTML += `
      <p>${i + 1}. <b>${w.name}</b>: ${w.wish}</p>
    `;
  });
}