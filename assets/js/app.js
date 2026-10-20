/**
 * SAJICEPAT - GLOBAL APPLICATION LOGIC & UTILITIES
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

// Utility: Format currency to Indonesian Rupiah
function formatRupiah(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) amount = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace(/\s+/g, ' ');
}

// Utility: Format date to readable Indonesian format
function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

// Global Toast Notification System
function showToast(message, type = 'success', duration = 3500) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-xmark';
  if (type === 'warning') iconClass = 'fa-triangle-exclamation';
  if (type === 'info') iconClass = 'fa-circle-info';

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${iconClass}"></i>
    </div>
    <div class="toast-content">
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  }, duration);
}

// Update Cart Badge Counter across pages
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.style.display = 'inline-flex';
      badge.classList.add('badge-bounce');
      setTimeout(() => badge.classList.remove('badge-bounce'), 400);
    } else {
      badge.style.display = 'none';
    }
  });
}

// Modal Control Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup Global Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Close modal when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // Mobile navigation hamburger toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navbarMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // Setup navbar auth state
  renderNavbarAuth();
  updateCartBadge();
  setupQuickRoleSwitcher();

  // Dynamic header elevation on scroll
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});

// Render dynamic authentication in Customer Navbar
function renderNavbarAuth() {
  const userContainer = document.getElementById('navUserContainer');
  if (!userContainer) return;

  const user = getCurrentUser();
  if (user) {
    let dashboardLink = 'profil.html';
    let roleLabel = 'Pelanggan';
    let roleBadgeColor = 'bg-primary-subtle text-primary';

    if (user.role === 'admin') {
      dashboardLink = 'admin/dashboard.html';
      roleLabel = 'Admin';
      roleBadgeColor = 'bg-danger-subtle text-danger';
    } else if (user.role === 'restoran') {
      dashboardLink = 'restoran/dashboard.html';
      roleLabel = 'Restoran';
      roleBadgeColor = 'bg-warning-subtle text-warning';
    }

    userContainer.innerHTML = `
      <div class="user-dropdown-wrapper">
        <button class="user-profile-btn" id="userMenuBtn">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" alt="${user.name}" class="user-avatar-sm">
          <div class="user-info-text">
            <span class="user-name">${user.name.split(' ')[0]}</span>
            <span class="user-role-badge ${roleBadgeColor}">${roleLabel}</span>
          </div>
          <i class="fa-solid fa-chevron-down text-xs"></i>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="user-dropdown-header">
            <p class="font-bold text-gray-900">${user.name}</p>
            <p class="text-xs text-gray-500">${user.email}</p>
          </div>
          <div class="user-dropdown-divider"></div>
          ${user.role === 'admin' ? `
            <a href="admin/dashboard.html" class="user-dropdown-item">
              <i class="fa-solid fa-gauge-high"></i> Dashboard Admin
            </a>
          ` : user.role === 'restoran' ? `
            <a href="restoran/dashboard.html" class="user-dropdown-item">
              <i class="fa-solid fa-store"></i> Dashboard Restoran
            </a>
          ` : `
            <a href="profil.html" class="user-dropdown-item">
              <i class="fa-solid fa-user"></i> Profil Saya
            </a>
            <a href="pesanan.html" class="user-dropdown-item">
              <i class="fa-solid fa-receipt"></i> Pesanan Saya
            </a>
          `}
          <div class="user-dropdown-divider"></div>
          <button class="user-dropdown-item text-danger" onclick="logoutUser()">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar
          </button>
        </div>
      </div>
    `;

    // Dropdown toggle listener
    const btn = document.getElementById('userMenuBtn');
    const menu = document.getElementById('userDropdownMenu');
    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('show');
        }
      });
    }
  } else {
    // Guest state
    userContainer.innerHTML = `
      <div class="nav-auth-buttons">
        <a href="login.html" class="btn btn-outline-primary btn-sm">Masuk</a>
        <a href="register.html" class="btn btn-primary btn-sm">Daftar</a>
      </div>
    `;
  }
}

// User Logout action
function logoutUser() {
  setCurrentUser(null);
  showToast('Berhasil keluar dari akun demo.', 'info');
  setTimeout(() => {
    // If in admin or restoran subdirectory, redirect to ../login.html
    if (window.location.pathname.includes('/admin/') || window.location.pathname.includes('/restoran/')) {
      window.location.href = '../login.html';
    } else {
      window.location.href = 'login.html';
    }
  }, 800);
}

// Setup floating demo role switcher for quick grading & presentation
function setupQuickRoleSwitcher() {
  // Avoid duplicating if already present
  if (document.getElementById('demoRoleSwitcher')) return;

  const user = getCurrentUser();
  const currentRole = user ? user.role : 'tamu';

  const switcher = document.createElement('div');
  switcher.id = 'demoRoleSwitcher';
  switcher.className = 'demo-role-switcher';
  switcher.innerHTML = `
    <div class="role-switcher-toggle" id="roleSwitcherToggle" title="Ganti Role Cepat Demo">
      <i class="fa-solid fa-sliders"></i>
      <span>Role Demo: <strong>${currentRole.toUpperCase()}</strong></span>
    </div>
    <div class="role-switcher-menu" id="roleSwitcherMenu">
      <div class="role-switcher-title">
        <span><i class="fa-solid fa-id-badge"></i> Simulasi Role Pengguna</span>
        <button id="closeRoleSwitcher" class="text-xs text-gray-400 hover:text-gray-700">&times;</button>
      </div>
      <p class="text-xs text-gray-500 mb-2">Pilih peran akun demo untuk menguji tampilan aplikasi secara instan:</p>
      <div class="role-switcher-buttons">
        <button class="role-btn ${currentRole === 'pelanggan' ? 'active' : ''}" onclick="quickSwitchRole('pelanggan')">
          <i class="fa-solid fa-user text-orange-500"></i>
          <div>
            <strong>Pelanggan</strong>
            <small>Budi Santoso</small>
          </div>
        </button>
        <button class="role-btn ${currentRole === 'restoran' ? 'active' : ''}" onclick="quickSwitchRole('restoran')">
          <i class="fa-solid fa-store text-yellow-600"></i>
          <div>
            <strong>Restoran</strong>
            <small>Ayam Geprek Juara</small>
          </div>
        </button>
        <button class="role-btn ${currentRole === 'admin' ? 'active' : ''}" onclick="quickSwitchRole('admin')">
          <i class="fa-solid fa-shield-halved text-red-500"></i>
          <div>
            <strong>Admin</strong>
            <small>Administrator</small>
          </div>
        </button>
      </div>
      <div class="role-switcher-footer">
        <button class="reset-db-btn" onclick="confirmResetDatabase()">
          <i class="fa-solid fa-rotate-left"></i> Reset Data Demo Asli
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(switcher);

  const toggleBtn = document.getElementById('roleSwitcherToggle');
  const menu = document.getElementById('roleSwitcherMenu');
  const closeBtn = document.getElementById('closeRoleSwitcher');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.remove('active');
      });
    }
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }
}

// Quick Switch role handler
function quickSwitchRole(role) {
  const users = getUsers();
  let targetUser = null;

  if (role === 'admin') {
    targetUser = users.find(u => u.role === 'admin');
  } else if (role === 'restoran') {
    targetUser = users.find(u => u.role === 'restoran');
  } else {
    targetUser = users.find(u => u.role === 'pelanggan');
  }

  if (targetUser) {
    setCurrentUser(targetUser);
    showToast(`Role dialihkan ke: ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'success');
    
    // Redirect smartly depending on role
    setTimeout(() => {
      const isSub = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/restoran/');
      if (role === 'admin') {
        window.location.href = isSub ? '../admin/dashboard.html' : 'admin/dashboard.html';
      } else if (role === 'restoran') {
        window.location.href = isSub ? '../restoran/dashboard.html' : 'restoran/dashboard.html';
      } else {
        window.location.href = isSub ? '../index.html' : 'index.html';
      }
    }, 600);
  }
}

// Reset data confirmation
function confirmResetDatabase() {
  if (confirm('Apakah Anda yakin ingin mereset seluruh data demo SajiCepat ke pengaturan awal?')) {
    resetDemoDatabase();
    showToast('Data demo berhasil direset ke pengaturan awal.', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }
}
