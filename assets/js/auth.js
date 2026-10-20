/**
 * SAJICEPAT - AUTHENTICATION LOGIC (LOGIN & REGISTER)
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 * Pure Frontend & LocalStorage Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  setupPasswordToggles();
  setupLoginForm();
  setupRegisterForm();
});

// Toggle password visibility
function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
          input.type = 'password';
          btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
      }
    });
  });
}

// Quick Fill Demo Credentials
function fillDemoLogin(emailOrRole, customPassword = null, customLabel = null) {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  if (!emailInput || !passwordInput) return;

  if (emailOrRole === 'admin') {
    emailInput.value = 'admin@sajicepat.com';
    passwordInput.value = 'admin';
    showToast('Kredensial demo ADMIN terisi. Klik "Masuk Sekarang"!', 'info', 2000);
  } else if (emailOrRole === 'restoran') {
    emailInput.value = 'resto@sajicepat.com';
    passwordInput.value = 'password123';
    showToast('Kredensial demo RESTORAN (Ayam Geprek) terisi. Klik "Masuk Sekarang"!', 'info', 2000);
  } else if (emailOrRole === 'pelanggan') {
    emailInput.value = 'budi@gmail.com';
    passwordInput.value = 'password123';
    showToast('Kredensial demo PELANGGAN (Budi Santoso) terisi. Klik "Masuk Sekarang"!', 'info', 2000);
  } else {
    emailInput.value = emailOrRole;
    passwordInput.value = customPassword || 'password123';
    showToast(`Kredensial demo "${customLabel || emailOrRole}" terisi!`, 'info', 2000);
  }
}

// Setup Login Form submission
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('Harap masukkan email dan password!', 'warning');
      return;
    }

    const users = getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (matchedUser) {
      setCurrentUser(matchedUser);
      showToast(`Selamat datang kembali, ${matchedUser.name}!`, 'success');

      setTimeout(() => {
        if (matchedUser.role === 'admin') {
          window.location.href = 'admin/dashboard.html';
        } else if (matchedUser.role === 'restoran') {
          window.location.href = 'restoran/dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 900);
    } else {
      showToast('Email atau password salah! Coba gunakan akun demo yang tersedia.', 'error');
    }
  });
}

// Setup Register Form submission
function setupRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const address = document.getElementById('regAddress')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('regConfirmPassword')?.value;

    if (!name || !email || !phone || !address || !password) {
      showToast('Harap lengkapi semua kolom formulir pendaftaran!', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Kata sandi minimal harus 6 karakter.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok!', 'error');
      return;
    }

    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('Email tersebut sudah terdaftar! Silakan login atau gunakan email lain.', 'error');
      return;
    }

    const role = document.getElementById('selectedRole')?.value || 'pelanggan';
    const category = document.getElementById('regCategory')?.value || 'Makanan berat';
    const hours = document.getElementById('regHours')?.value.trim() || '09:00 - 21:00';

    if (role === 'restoran') {
      // 1. Create Restaurant Entry
      const restos = getRestaurants();
      const newRestoId = Date.now();
      const newResto = {
        id: newRestoId,
        name: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category: category,
        rating: 5.0,
        reviewsCount: 0,
        address: address,
        phone: phone,
        operationalHours: hours,
        deliveryFee: 8000,
        minOrder: 15000,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150',
        description: `Mitra resmi SajiCepat menyajikan aneka sajian lezat kategori ${category}.`
      };
      restos.push(newResto);
      saveRestaurants(restos);

      // 2. Create User Account with role: 'restoran'
      const newUser = {
        id: Date.now() + 1,
        name: name,
        email: email,
        password: password,
        role: 'restoran',
        restoId: newRestoId,
        phone: phone,
        address: address,
        avatar: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().slice(0, 10)
      };

      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);

      showToast(`Pendaftaran Mitra Berhasil! Selamat datang, ${name}.`, 'success');
      setTimeout(() => {
        window.location.href = 'restoran/dashboard.html';
      }, 1000);
    } else {
      // Customer Account Registration
      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: 'pelanggan',
        phone: phone,
        address: address,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().slice(0, 10)
      };

      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);

      showToast(`Akun berhasil dibuat! Selamat datang di SajiCepat, ${name}.`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  });
}
