// admin/admin.js — логика админ-панели (чистый JS, без React)
const API_URL = "http://localhost:3000/api";

let adminKey = "";

// ============ Авторизация в админке ============
document.getElementById("loginBtn").addEventListener("click", async () => {
  const key = document.getElementById("adminKey").value.trim();
  if (!key) return;

  // Проверяем ключ запросом к защищённому маршруту
  const response = await fetch(`${API_URL}/users`, {
    headers: { "x-admin-key": key },
  });

  if (response.ok) {
    adminKey = key;
    localStorage.setItem("adminKey", key);
    showAdmin();
  } else {
    document.getElementById("loginError").textContent = "Неверный ключ";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("adminKey");
  adminKey = "";
  location.reload();
});

// Если ключ уже сохранён — сразу заходим
const savedKey = localStorage.getItem("adminKey");
if (savedKey) {
  adminKey = savedKey;
  showAdmin();
}

function showAdmin() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminContent").style.display = "block";
  document.getElementById("logoutBtn").style.display = "inline-block";
  loadUsers();
}

// ============ Переключение вкладок ============
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");

    // Подгружаем данные при переключении
    if (btn.dataset.tab === "users") loadUsers();
    if (btn.dataset.tab === "movies") loadMovies();
    if (btn.dataset.tab === "orders") loadOrders();
    if (btn.dataset.tab === "images") loadImages();
  });
});

// ============ Хелпер: fetch с ключом админа ============
async function adminFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
      ...(options.headers || {}),
    },
  });
}

// ============ Пользователи ============
async function loadUsers() {
  const res = await adminFetch(`${API_URL}/users`);
  const users = await res.json();

  const tbody = document.getElementById("usersTbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.createdAt}</td>
      <td><button class="danger" data-id="${user.id}">Удалить</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Делегирование клика на кнопки удаления
document.getElementById("usersTbody").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const id = e.target.dataset.id;
  if (!confirm("Удалить пользователя?")) return;

  await adminFetch(`${API_URL}/users/${id}`, { method: "DELETE" });
  loadUsers();
});

// ============ Фильмы ============
async function loadMovies() {
  const res = await fetch(`${API_URL}/movies`);
  const movies = await res.json();

  const tbody = document.getElementById("moviesTbody");
  tbody.innerHTML = "";

  movies.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.poster ? `<img src="http://localhost:3000${m.poster}" alt="" width="40" />` : "—"}</td>
      <td>${m.title}</td>
      <td>${m.year}</td>
      <td>${m.genre}</td>
      <td>${m.rating}</td>
      <td><button class="danger" data-id="${m.id}">Удалить</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("moviesTbody").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const id = e.target.dataset.id;
  if (!confirm("Удалить фильм?")) return;

  await adminFetch(`${API_URL}/movies/${id}`, { method: "DELETE" });
  loadMovies();
});

// Форма добавления фильма
document.getElementById("movieForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  data.year = Number(data.year);
  data.rating = Number(data.rating) || 0;
  data.duration = Number(data.duration) || 0;

  await adminFetch(`${API_URL}/movies`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  e.target.reset();
  loadMovies();
});

// ============ Избранное ============
async function loadOrders() {
  const res = await adminFetch(`${API_URL}/orders`);
  const orders = await res.json();

  const tbody = document.getElementById("ordersTbody");
  tbody.innerHTML = "";

  orders.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.userName} (${o.userEmail})</td>
      <td>${o.movieTitle} (${o.movieYear})</td>
      <td>${o.status}</td>
      <td>${o.createdAt}</td>
      <td><button class="danger" data-id="${o.id}">Удалить</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("ordersTbody").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const id = e.target.dataset.id;
  if (!confirm("Удалить запись?")) return;

  await adminFetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
  loadOrders();
});

// ============ Изображения ============
async function loadImages() {
  const res = await fetch(`${API_URL}/upload`);
  const images = await res.json();

  const grid = document.getElementById("imagesGrid");
  grid.innerHTML = "";

  images.forEach((img) => {
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = `
      <img src="http://localhost:3000${img.path}" alt="${img.originalName}" />
      <p>${img.originalName}</p>
    `;
    grid.appendChild(card);
  });
}

// Форма загрузки файла
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = e.target.querySelector('input[type="file"]');
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  // Для загрузки файла НЕ ставим Content-Type — браузер сам выставит multipart/form-data
  await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: formData,
  });

  e.target.reset();
  loadImages();
});