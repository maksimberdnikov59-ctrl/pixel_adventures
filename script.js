// Данные: работаем с localStorage (имитация базы данных)
function getUsers() {
    const users = localStorage.getItem('pixel_users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('pixel_users', JSON.stringify(users));
}

let currentUser = null;

// DOM элементы
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const authLinks = document.getElementById('authLinks');
const userMenu = document.getElementById('userMenu');
const userGreeting = document.getElementById('userGreeting');

function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModals() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

function updateUI() {
    if (currentUser) {
        authLinks.style.display = 'none';
        userMenu.style.display = 'flex';
        userGreeting.textContent = `Привет, ${currentUser.name}!`;
    } else {
        authLinks.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Регистрация
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (!name || !email || !password) {
        alert('Заполните все поля');
        return;
    }

    let users = getUsers();
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    alert('Регистрация успешна! Теперь войдите.');
    hideModals();
    registerModal.querySelector('form').reset();
});

// Вход
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        updateUI();
        hideModals();
        alert(`Добро пожаловать, ${user.name}!`);
        loginModal.querySelector('form').reset();
    } else {
        alert('Неверный email или пароль');
    }
});

// Выход
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    updateUI();
    alert('Вы вышли из аккаунта');
});

// Открытие модалок
document.getElementById('showLoginBtn').addEventListener('click', () => showModal(loginModal));
document.getElementById('showRegisterBtn').addEventListener('click', () => showModal(registerModal));
document.getElementById('heroRegisterBtn').addEventListener('click', () => showModal(registerModal));
document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    hideModals();
    showModal(registerModal);
});
document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    hideModals();
    showModal(loginModal);
});

// Закрытие модалок
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', hideModals);
});
window.addEventListener('click', (e) => {
    if (e.target === loginModal) hideModals();
    if (e.target === registerModal) hideModals();
});

updateUI();