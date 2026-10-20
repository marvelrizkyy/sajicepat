/**
 * SAJICEPAT - ADMIN DASHBOARD & CRUD CONTROLLER
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

let salesTrendChartInstance = null;
let categoryChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check Admin Authorization
  checkAdminAuth();

  // Setup mobile sidebar toggle
  setupSidebarToggle();

  // Route to page-specific initializers
  const path = window.location.pathname;
  if (path.includes('dashboard.html') || path.endsWith('/admin/')) {
    initAdminDashboard();
  } else if (path.includes('pelanggan.html')) {
    initPelangganCRUD();
  } else if (path.includes('restoran.html')) {
    initRestoranCRUD();
  } else if (path.includes('kategori.html')) {
    initKategoriCRUD();
  } else if (path.includes('menu.html')) {
    initMenuCRUD();
  } else if (path.includes('pesanan.html')) {
    initPesananAdmin();
  } else if (path.includes('laporan.html')) {
    initLaporanAdmin();
  }
});

function checkAdminAuth() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    // If not admin, inform and allow demo fallback or redirect
    console.warn('Sesi saat ini bukan Admin. Menampilkan mode demo admin.');
  }

  // Update topbar and sidebar admin info
  const nameEl = document.getElementById('adminUserName');
  if (nameEl && user) nameEl.textContent = user.name;
}

function setupSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('dashboardSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }
}

// ==========================================
// 1. ADMIN DASHBOARD OVERVIEW & CHARTS
// ==========================================
function initAdminDashboard() {
  renderAdminStats();
  renderAdminCharts();
  renderRecentOrdersTable();
  renderTopSellingMenus();
}

function renderAdminStats() {
  const users = getUsers();
  const customers = users.filter(u => u.role === 'pelanggan');
  const restos = getRestaurants();
  const menus = getMenus();
  const orders = getOrders();

  const totalRevenue = orders
    .filter(o => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const elCustomers = document.getElementById('statTotalPelanggan');
  const elRestos = document.getElementById('statTotalRestoran');
  const elMenus = document.getElementById('statTotalMenu');
  const elOrders = document.getElementById('statTotalPesanan');
  const elRevenue = document.getElementById('statTotalOmset');

  if (elCustomers) elCustomers.textContent = customers.length;
  if (elRestos) elRestos.textContent = restos.length;
  if (elMenus) elMenus.textContent = menus.length;
  if (elOrders) elOrders.textContent = orders.length;
  if (elRevenue) elRevenue.textContent = formatRupiah(totalRevenue);
}

function renderAdminCharts() {
  const ctxTrend = document.getElementById('salesTrendChart')?.getContext('2d');
  const ctxCategory = document.getElementById('categoryPieChart')?.getContext('2d');

  if (ctxTrend && typeof Chart !== 'undefined') {
    if (salesTrendChartInstance) salesTrendChartInstance.destroy();
    salesTrendChartInstance = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [{
          label: 'Penjualan Demo (Rp Ribu)',
          data: [120, 190, 240, 180, 320, 480, 520],
          borderColor: '#F97316',
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#EA580C',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => 'Rp ' + value + 'k'
            }
          }
        }
      }
    });
  }

  if (ctxCategory && typeof Chart !== 'undefined') {
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['Makanan Berat', 'Fast Food', 'Minuman', 'Dessert', 'Makanan Ringan'],
        datasets: [{
          data: [42, 25, 18, 10, 5],
          backgroundColor: [
            '#F97316',
            '#FB923C',
            '#3B82F6',
            '#EC4899',
            '#10B981'
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function renderRecentOrdersTable() {
  const tableBody = document.getElementById('recentOrdersTableBody');
  if (!tableBody) return;

  const orders = getOrders().slice(0, 5);

  tableBody.innerHTML = orders.map(order => {
    const statusSlug = (order.status || 'menunggu-konfirmasi').toLowerCase().replace(/\s+/g, '-');
    return `
      <tr>
        <td class="font-bold text-gray-900">${order.id}</td>
        <td>
          <div class="table-user-info">
            <span class="font-semibold text-xs">${order.customerName}</span>
          </div>
        </td>
        <td class="text-xs text-muted">${order.restoName}</td>
        <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
        <td>
          <span class="status-badge status-${statusSlug}">
            ${order.status}
          </span>
        </td>
        <td>
          <a href="pesanan.html" class="btn-table-action btn-view" title="Lihat Pesanan">
            <i class="fa-solid fa-eye"></i>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function renderTopSellingMenus() {
  const container = document.getElementById('topSellingMenusContainer');
  if (!container) return;

  const menus = getMenus()
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 4);

  container.innerHTML = menus.map(menu => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid #F1F5F9;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <img src="${menu.image}" alt="${menu.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
        <div>
          <h5 class="font-bold text-gray-900" style="font-size: 0.88rem; margin-bottom: 2px;">${menu.name}</h5>
          <span class="text-xs text-muted">${menu.category} • ${menu.soldCount} terjual</span>
        </div>
      </div>
      <span class="font-bold text-primary" style="font-size: 0.9rem;">${formatRupiah(menu.price)}</span>
    </div>
  `).join('');
}

// ==========================================
// 2. CRUD PELANGGAN
// ==========================================
function initPelangganCRUD() {
  renderPelangganTable();

  const searchInput = document.getElementById('searchPelangganInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPelangganTable(e.target.value);
    });
  }

  const form = document.getElementById('pelangganForm');
  if (form) {
    form.addEventListener('submit', handleSavePelanggan);
  }
}

function renderPelangganTable(searchQuery = '') {
  const tbody = document.getElementById('pelangganTableBody');
  if (!tbody) return;

  const users = getUsers().filter(u => u.role === 'pelanggan');
  const q = searchQuery.toLowerCase().trim();

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    (u.phone && u.phone.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Tidak ada data pelanggan yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((user, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div class="table-user-info">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" class="table-avatar" alt="${user.name}">
          <div>
            <h5 class="font-bold text-gray-900" style="font-size: 0.9rem;">${user.name}</h5>
            <span class="text-xs text-muted">${user.email}</span>
          </div>
        </div>
      </td>
      <td class="text-xs">${user.phone || '-'}</td>
      <td class="text-xs" style="max-width: 240px;">${user.address || '-'}</td>
      <td class="text-xs text-muted">${formatDate(user.createdAt)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-table-action btn-edit" onclick="openEditPelangganModal(${user.id})" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action btn-delete" onclick="deletePelanggan(${user.id})" title="Hapus">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddPelangganModal() {
  document.getElementById('pelangganModalTitle').textContent = 'Tambah Pelanggan Baru';
  document.getElementById('pelangganId').value = '';
  document.getElementById('pelangganName').value = '';
  document.getElementById('pelangganEmail').value = '';
  document.getElementById('pelangganPhone').value = '';
  document.getElementById('pelangganAddress').value = '';
  document.getElementById('pelangganPassword').value = 'password123';
  openModal('pelangganModal');
}

function openEditPelangganModal(id) {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  if (!user) return;

  document.getElementById('pelangganModalTitle').textContent = 'Edit Data Pelanggan';
  document.getElementById('pelangganId').value = user.id;
  document.getElementById('pelangganName').value = user.name;
  document.getElementById('pelangganEmail').value = user.email;
  document.getElementById('pelangganPhone').value = user.phone || '';
  document.getElementById('pelangganAddress').value = user.address || '';
  document.getElementById('pelangganPassword').value = user.password || '';
  openModal('pelangganModal');
}

function handleSavePelanggan(e) {
  e.preventDefault();
  const id = document.getElementById('pelangganId').value;
  const name = document.getElementById('pelangganName').value.trim();
  const email = document.getElementById('pelangganEmail').value.trim();
  const phone = document.getElementById('pelangganPhone').value.trim();
  const address = document.getElementById('pelangganAddress').value.trim();
  const password = document.getElementById('pelangganPassword').value.trim();

  let users = getUsers();

  if (id) {
    // Edit existing
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index > -1) {
      users[index].name = name;
      users[index].email = email;
      users[index].phone = phone;
      users[index].address = address;
      if (password) users[index].password = password;
      saveUsers(users);
      showToast('Data pelanggan berhasil diperbarui!', 'success');
    }
  } else {
    // Add new
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      password: password || 'password123',
      role: 'pelanggan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    users.push(newUser);
    saveUsers(users);
    showToast('Pelanggan baru berhasil ditambahkan!', 'success');
  }

  closeModal('pelangganModal');
  renderPelangganTable();
}

function deletePelanggan(id) {
  if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini dari data demo?')) {
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    showToast('Data pelanggan berhasil dihapus.', 'info');
    renderPelangganTable();
  }
}

// ==========================================
// 3. CRUD RESTORAN
// ==========================================
function initRestoranCRUD() {
  renderRestoranTable();

  const searchInput = document.getElementById('searchRestoranInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderRestoranTable(e.target.value);
    });
  }

  const form = document.getElementById('restoranForm');
  if (form) {
    form.addEventListener('submit', handleSaveRestoran);
  }
}

function renderRestoranTable(searchQuery = '') {
  const tbody = document.getElementById('restoranTableBody');
  if (!tbody) return;

  const restos = getRestaurants();
  const q = searchQuery.toLowerCase().trim();

  const filtered = restos.filter(r => 
    r.name.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q) ||
    r.address.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada restoran yang cocok.</td></tr>`;
    return;
  }

  const users = getUsers();
  tbody.innerHTML = filtered.map((r, idx) => {
    const matchedUser = users.find(u => u.role === 'restoran' && (u.restoId === r.id || (r.slug && u.email.toLowerCase().includes(r.slug.replace(/-/g, '')))));
    return `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div class="table-user-info">
          <img src="${r.image}" class="table-food-img" alt="${r.name}">
          <div>
            <h5 class="font-bold text-gray-900" style="font-size: 0.9rem;">${r.name}</h5>
            <span class="text-xs text-muted"><i class="fa-solid fa-clock"></i> ${r.operationalHours}</span>
            ${matchedUser ? `<div class="text-xs text-primary font-semibold mt-1" style="font-size: 0.75rem;"><i class="fa-solid fa-envelope"></i> ${matchedUser.email}</div>` : ''}
          </div>
        </div>
      </td>
      <td><span class="badge badge-primary">${r.category}</span></td>
      <td class="text-xs"><i class="fa-solid fa-star text-warning"></i> <strong>${r.rating}</strong> (${r.reviewsCount})</td>
      <td class="text-xs" style="max-width: 220px;">${r.address}</td>
      <td class="text-xs font-semibold">${formatRupiah(r.deliveryFee)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-table-action btn-edit" onclick="openEditRestoranModal(${r.id})" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action btn-delete" onclick="deleteRestoran(${r.id})" title="Hapus">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function openAddRestoranModal() {
  document.getElementById('restoranModalTitle').textContent = 'Tambah Restoran Mitra Baru';
  document.getElementById('restoranId').value = '';
  document.getElementById('restoName').value = '';
  document.getElementById('restoCategory').value = 'Makanan berat';
  document.getElementById('restoPhone').value = '';
  document.getElementById('restoAddress').value = '';
  document.getElementById('restoHours').value = '09:00 - 21:00';
  document.getElementById('restoDeliveryFee').value = '8000';
  document.getElementById('restoImage').value = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600';
  document.getElementById('restoDesc').value = '';
  if (document.getElementById('restoEmail')) document.getElementById('restoEmail').value = '';
  if (document.getElementById('restoPassword')) document.getElementById('restoPassword').value = 'password123';
  openModal('restoranModal');
}

function openEditRestoranModal(id) {
  const restos = getRestaurants();
  const r = restos.find(item => item.id === id);
  if (!r) return;

  const users = getUsers();
  const matchedUser = users.find(u => u.role === 'restoran' && u.restoId === r.id);

  document.getElementById('restoranModalTitle').textContent = 'Edit Data Restoran Mitra';
  document.getElementById('restoranId').value = r.id;
  document.getElementById('restoName').value = r.name;
  document.getElementById('restoCategory').value = r.category;
  document.getElementById('restoPhone').value = r.phone;
  document.getElementById('restoAddress').value = r.address;
  document.getElementById('restoHours').value = r.operationalHours;
  document.getElementById('restoDeliveryFee').value = r.deliveryFee;
  document.getElementById('restoImage').value = r.image;
  document.getElementById('restoDesc').value = r.description;
  if (document.getElementById('restoEmail')) document.getElementById('restoEmail').value = matchedUser ? matchedUser.email : '';
  if (document.getElementById('restoPassword')) document.getElementById('restoPassword').value = matchedUser ? matchedUser.password : '';
  openModal('restoranModal');
}

function handleSaveRestoran(e) {
  e.preventDefault();
  const id = document.getElementById('restoranId').value;
  const name = document.getElementById('restoName').value.trim();
  const category = document.getElementById('restoCategory').value;
  const phone = document.getElementById('restoPhone').value.trim();
  const address = document.getElementById('restoAddress').value.trim();
  const hours = document.getElementById('restoHours').value.trim();
  const fee = parseInt(document.getElementById('restoDeliveryFee').value) || 8000;
  const image = document.getElementById('restoImage').value.trim();
  const desc = document.getElementById('restoDesc').value.trim();
  const email = document.getElementById('restoEmail')?.value.trim();
  const password = document.getElementById('restoPassword')?.value.trim() || 'password123';

  let restos = getRestaurants();
  let users = getUsers();

  if (id) {
    const idx = restos.findIndex(r => r.id === parseInt(id));
    if (idx > -1) {
      restos[idx].name = name;
      restos[idx].category = category;
      restos[idx].phone = phone;
      restos[idx].address = address;
      restos[idx].operationalHours = hours;
      restos[idx].deliveryFee = fee;
      restos[idx].image = image || restos[idx].image;
      restos[idx].description = desc;
      saveRestaurants(restos);

      // Update corresponding user login
      const userIdx = users.findIndex(u => u.role === 'restoran' && u.restoId === parseInt(id));
      if (userIdx > -1) {
        users[userIdx].name = name;
        if (email) users[userIdx].email = email;
        if (password) users[userIdx].password = password;
        users[userIdx].phone = phone;
        users[userIdx].address = address;
        saveUsers(users);
      }
      showToast('Data restoran mitra & kredensial berhasil diperbarui!', 'success');
    }
  } else {
    const newRestoId = Date.now();
    const newResto = {
      id: newRestoId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category,
      rating: 4.8,
      reviewsCount: 1,
      address,
      phone,
      operationalHours: hours,
      deliveryFee: fee,
      minOrder: 15000,
      image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      description: desc
    };
    restos.push(newResto);
    saveRestaurants(restos);

    // Auto-create user login account for the new restaurant
    const restoEmail = email || `resto.${newResto.slug.replace(/-/g, '')}@sajicepat.com`;
    const newUser = {
      id: Date.now() + 1,
      name: name,
      email: restoEmail,
      password: password,
      role: 'restoran',
      restoId: newRestoId,
      phone: phone,
      address: address,
      avatar: image || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=120',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    users.push(newUser);
    saveUsers(users);

    showToast(`Restoran "${name}" dan akun login (${restoEmail}) berhasil ditambahkan!`, 'success');
  }

  closeModal('restoranModal');
  renderRestoranTable();
}

function deleteRestoran(id) {
  if (confirm('Apakah Anda yakin ingin menghapus restoran mitra ini?')) {
    let restos = getRestaurants();
    restos = restos.filter(r => r.id !== id);
    saveRestaurants(restos);
    showToast('Restoran berhasil dihapus.', 'info');
    renderRestoranTable();
  }
}

// ==========================================
// 4. CRUD KATEGORI
// ==========================================
function initKategoriCRUD() {
  renderKategoriTable();

  const form = document.getElementById('kategoriForm');
  if (form) {
    form.addEventListener('submit', handleSaveKategori);
  }
}

function renderKategoriTable() {
  const tbody = document.getElementById('kategoriTableBody');
  if (!tbody) return;

  const categories = getCategories();
  const menus = getMenus();

  tbody.innerHTML = categories.map((cat, idx) => {
    const count = cat.name === 'Semua' ? menus.length : menus.filter(m => m.category === cat.name).length;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--primary-light); color: var(--primary-hover); display: flex; align-items: center; justify-content: center; font-size: 1rem;">
              <i class="fa-solid ${cat.icon || 'fa-utensils'}"></i>
            </div>
            <strong class="text-gray-900">${cat.name}</strong>
          </div>
        </td>
        <td class="text-xs text-muted font-mono">${cat.slug}</td>
        <td><span class="badge badge-primary">${count} Menu Terdaftar</span></td>
        <td>
          ${cat.name !== 'Semua' ? `
            <div class="action-btns">
              <button class="btn-table-action btn-edit" onclick="openEditKategoriModal(${cat.id})" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-table-action btn-delete" onclick="deleteKategori(${cat.id})" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ` : '<span class="text-xs text-muted">Kategori Bawaan</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function openAddKategoriModal() {
  document.getElementById('kategoriModalTitle').textContent = 'Tambah Kategori Makanan';
  document.getElementById('kategoriId').value = '';
  document.getElementById('kategoriName').value = '';
  document.getElementById('kategoriIcon').value = 'fa-bowl-rice';
  openModal('kategoriModal');
}

function openEditKategoriModal(id) {
  const categories = getCategories();
  const cat = categories.find(c => c.id === id);
  if (!cat) return;

  document.getElementById('kategoriModalTitle').textContent = 'Edit Kategori';
  document.getElementById('kategoriId').value = cat.id;
  document.getElementById('kategoriName').value = cat.name;
  document.getElementById('kategoriIcon').value = cat.icon || 'fa-bowl-rice';
  openModal('kategoriModal');
}

function handleSaveKategori(e) {
  e.preventDefault();
  const id = document.getElementById('kategoriId').value;
  const name = document.getElementById('kategoriName').value.trim();
  const icon = document.getElementById('kategoriIcon').value.trim();

  let categories = getCategories();

  if (id) {
    const idx = categories.findIndex(c => c.id === parseInt(id));
    if (idx > -1) {
      categories[idx].name = name;
      categories[idx].slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      categories[idx].icon = icon;
      saveCategories(categories);
      showToast('Kategori berhasil diperbarui!', 'success');
    }
  } else {
    const newCat = {
      id: Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      icon: icon || 'fa-utensils',
      count: 0
    };
    categories.push(newCat);
    saveCategories(categories);
    showToast('Kategori baru berhasil ditambahkan!', 'success');
  }

  closeModal('kategoriModal');
  renderKategoriTable();
}

function deleteKategori(id) {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    let categories = getCategories();
    categories = categories.filter(c => c.id !== id);
    saveCategories(categories);
    showToast('Kategori berhasil dihapus.', 'info');
    renderKategoriTable();
  }
}

// ==========================================
// 5. CRUD MENU MAKANAN
// ==========================================
function initMenuCRUD() {
  renderRestoSelectOptions();
  renderMenuTable();

  const searchInput = document.getElementById('searchMenuInput');
  const filterResto = document.getElementById('filterMenuResto');
  const filterCategory = document.getElementById('filterMenuCategory');

  if (searchInput) searchInput.addEventListener('input', applyMenuFilters);
  if (filterResto) filterResto.addEventListener('change', applyMenuFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyMenuFilters);

  const form = document.getElementById('menuForm');
  if (form) form.addEventListener('submit', handleSaveMenu);
}

function renderRestoSelectOptions() {
  const restos = getRestaurants();
  const filterSelect = document.getElementById('filterMenuResto');
  const formSelect = document.getElementById('menuRestoId');

  const options = restos.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

  if (filterSelect) {
    filterSelect.innerHTML = `<option value="all">Semua Restoran</option>` + options;
  }
  if (formSelect) {
    formSelect.innerHTML = options;
  }
}

function applyMenuFilters() {
  const q = document.getElementById('searchMenuInput')?.value || '';
  const resto = document.getElementById('filterMenuResto')?.value || 'all';
  const cat = document.getElementById('filterMenuCategory')?.value || 'all';
  renderMenuTable(q, resto, cat);
}

function renderMenuTable(searchQuery = '', filterResto = 'all', filterCategory = 'all') {
  const tbody = document.getElementById('menuTableBody');
  if (!tbody) return;

  let menus = getMenus();
  const q = searchQuery.toLowerCase().trim();

  if (q) {
    menus = menus.filter(m => m.name.toLowerCase().includes(q) || m.restoName.toLowerCase().includes(q));
  }
  if (filterResto !== 'all') {
    menus = menus.filter(m => m.restoId === parseInt(filterResto));
  }
  if (filterCategory !== 'all') {
    menus = menus.filter(m => m.category === filterCategory);
  }

  if (menus.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Tidak ada data menu yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = menus.map((menu, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div class="table-user-info">
          <img src="${menu.image}" class="table-food-img" alt="${menu.name}">
          <div>
            <h5 class="font-bold text-gray-900" style="font-size: 0.9rem;">${menu.name}</h5>
            <span class="text-xs text-muted"><i class="fa-solid fa-store text-orange-500"></i> ${menu.restoName}</span>
          </div>
        </div>
      </td>
      <td><span class="badge badge-primary">${menu.category}</span></td>
      <td class="font-bold text-primary">${formatRupiah(menu.price)}</td>
      <td class="text-xs font-semibold">${menu.stock} porsi</td>
      <td>
        <button class="status-badge ${menu.isAvailable ? 'status-tersedia' : 'status-habis'}" onclick="toggleMenuAvailability(${menu.id})" style="cursor: pointer; border: none;" title="Klik untuk ubah status ketersediaan">
          ${menu.isAvailable ? 'Tersedia' : 'Habis'}
        </button>
      </td>
      <td class="text-xs"><i class="fa-solid fa-star text-warning"></i> ${menu.rating}</td>
      <td>
        <div class="action-btns">
          <button class="btn-table-action btn-edit" onclick="openEditMenuModal(${menu.id})" title="Edit Menu">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action btn-delete" onclick="deleteMenu(${menu.id})" title="Hapus Menu">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddMenuModal() {
  document.getElementById('menuModalTitle').textContent = 'Tambah Menu Makanan Baru';
  document.getElementById('menuId').value = '';
  document.getElementById('menuName').value = '';
  document.getElementById('menuPrice').value = '';
  document.getElementById('menuOriginalPrice').value = '';
  document.getElementById('menuStock').value = '30';
  document.getElementById('menuImage').value = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
  document.getElementById('menuDesc').value = '';
  document.getElementById('menuIsAvailable').checked = true;
  openModal('menuModal');
}

function openEditMenuModal(id) {
  const menus = getMenus();
  const menu = menus.find(m => m.id === id);
  if (!menu) return;

  document.getElementById('menuModalTitle').textContent = 'Edit Menu Makanan';
  document.getElementById('menuId').value = menu.id;
  document.getElementById('menuName').value = menu.name;
  document.getElementById('menuRestoId').value = menu.restoId;
  document.getElementById('menuFormCategory').value = menu.category;
  document.getElementById('menuPrice').value = menu.price;
  document.getElementById('menuOriginalPrice').value = menu.originalPrice || '';
  document.getElementById('menuStock').value = menu.stock;
  document.getElementById('menuImage').value = menu.image;
  document.getElementById('menuDesc').value = menu.description;
  document.getElementById('menuIsAvailable').checked = menu.isAvailable;
  openModal('menuModal');
}

function handleSaveMenu(e) {
  e.preventDefault();
  const id = document.getElementById('menuId').value;
  const name = document.getElementById('menuName').value.trim();
  const restoId = parseInt(document.getElementById('menuRestoId').value);
  const category = document.getElementById('menuFormCategory').value;
  const price = parseInt(document.getElementById('menuPrice').value) || 0;
  const originalPrice = parseInt(document.getElementById('menuOriginalPrice').value) || price;
  const stock = parseInt(document.getElementById('menuStock').value) || 0;
  const image = document.getElementById('menuImage').value.trim();
  const description = document.getElementById('menuDesc').value.trim();
  const isAvailable = document.getElementById('menuIsAvailable').checked;

  const restos = getRestaurants();
  const resto = restos.find(r => r.id === restoId);
  const restoName = resto ? resto.name : 'Restoran SajiCepat';

  let menus = getMenus();

  if (id) {
    const idx = menus.findIndex(m => m.id === parseInt(id));
    if (idx > -1) {
      menus[idx].name = name;
      menus[idx].restoId = restoId;
      menus[idx].restoName = restoName;
      menus[idx].category = category;
      menus[idx].price = price;
      menus[idx].originalPrice = originalPrice;
      menus[idx].stock = stock;
      menus[idx].image = image || menus[idx].image;
      menus[idx].description = description;
      menus[idx].isAvailable = isAvailable;
      saveMenus(menus);
      showToast('Menu makanan berhasil diperbarui!', 'success');
    }
  } else {
    const newMenu = {
      id: Date.now(),
      name,
      restoId,
      restoName,
      category,
      price,
      originalPrice,
      rating: 4.8,
      soldCount: 0,
      stock,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      description,
      isAvailable
    };
    menus.push(newMenu);
    saveMenus(menus);
    showToast('Menu makanan baru berhasil ditambahkan!', 'success');
  }

  closeModal('menuModal');
  applyMenuFilters();
}

function toggleMenuAvailability(id) {
  let menus = getMenus();
  const menu = menus.find(m => m.id === id);
  if (menu) {
    menu.isAvailable = !menu.isAvailable;
    saveMenus(menus);
    showToast(`Status "${menu.name}" diubah menjadi: ${menu.isAvailable ? 'Tersedia' : 'Habis'}.`, 'info');
    applyMenuFilters();
  }
}

function deleteMenu(id) {
  if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
    let menus = getMenus();
    menus = menus.filter(m => m.id !== id);
    saveMenus(menus);
    showToast('Menu makanan berhasil dihapus.', 'info');
    applyMenuFilters();
  }
}

// ==========================================
// 6. CRUD PESANAN (ADMIN)
// ==========================================
function initPesananAdmin() {
  renderAdminOrdersTable();

  const searchInput = document.getElementById('searchOrderAdminInput');
  const statusFilter = document.getElementById('filterOrderStatusAdmin');

  if (searchInput) {
    searchInput.addEventListener('input', applyAdminOrderFilters);
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', applyAdminOrderFilters);
  }

  const form = document.getElementById('updateOrderStatusForm');
  if (form) {
    form.addEventListener('submit', handleUpdateOrderStatus);
  }
}

function applyAdminOrderFilters() {
  const q = document.getElementById('searchOrderAdminInput')?.value || '';
  const status = document.getElementById('filterOrderStatusAdmin')?.value || 'all';
  renderAdminOrdersTable(q, status);
}

function renderAdminOrdersTable(searchQuery = '', statusFilter = 'all') {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  let orders = getOrders();
  const q = searchQuery.toLowerCase().trim();

  if (q) {
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.restoName.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== 'all') {
    orders = orders.filter(o => o.status === statusFilter);
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada pesanan yang sesuai filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const statusSlug = (order.status || 'menunggu-konfirmasi').toLowerCase().replace(/\s+/g, '-');
    return `
      <tr>
        <td class="font-bold text-gray-900">${order.id}</td>
        <td>
          <div class="table-user-info">
            <div>
              <h5 class="font-bold text-gray-900 text-xs">${order.customerName}</h5>
              <span class="text-xs text-muted">${order.customerPhone}</span>
            </div>
          </div>
        </td>
        <td class="text-xs text-muted">${order.restoName}</td>
        <td class="text-xs">${formatDate(order.createdAt)}</td>
        <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
        <td>
          <span class="status-badge status-${statusSlug}">
            ${order.status}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="btn-table-action btn-edit" onclick="openUpdateOrderStatusModal('${order.id}')" title="Ubah Status">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="btn-table-action btn-view" onclick="openAdminOrderInvoice('${order.id}')" title="Lihat Invoice">
              <i class="fa-solid fa-receipt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openUpdateOrderStatusModal(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('orderStatusModalCode').textContent = order.id;
  document.getElementById('editOrderId').value = order.id;
  document.getElementById('newOrderStatus').value = order.status;
  openModal('updateOrderStatusModal');
}

function handleUpdateOrderStatus(e) {
  e.preventDefault();
  const orderId = document.getElementById('editOrderId').value;
  const newStatus = document.getElementById('newOrderStatus').value;

  let orders = getOrders();
  const order = orders.find(o => o.id === orderId);

  if (order) {
    order.status = newStatus;
    if (!order.history) order.history = [];
    const now = new Date();
    order.history.push({
      status: newStatus,
      time: now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5)
    });
    saveOrders(orders);
    showToast(`Status pesanan ${orderId} berhasil diubah ke: ${newStatus}`, 'success');
  }

  closeModal('updateOrderStatusModal');
  applyAdminOrderFilters();
}

function openAdminOrderInvoice(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const content = document.getElementById('adminInvoiceContent');
  if (!content) return;

  content.innerHTML = `
    <div style="border-bottom: 2px dashed #E2E8F0; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 class="font-bold text-gray-900" style="font-size: 1.35rem;">INVOICE PESANAN</h3>
          <p class="text-xs text-muted">SajiCepat Food Delivery Demo</p>
        </div>
        <span class="status-badge status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
      </div>
      <div style="margin-top: 1rem; font-size: 0.85rem; line-height: 1.5;">
        <p>Kode: <strong>${order.id}</strong></p>
        <p>Waktu: <strong>${formatDate(order.createdAt)}</strong></p>
        <p>Restoran: <strong>${order.restoName}</strong></p>
        <p>Pelanggan: <strong>${order.customerName}</strong> (${order.customerPhone})</p>
        <p>Alamat: <strong>${order.deliveryAddress}</strong></p>
      </div>
    </div>

    <h5 class="font-bold text-gray-900 mb-2">Item Menu:</h5>
    <div style="margin-bottom: 1.25rem;">
      ${(order.items || []).map(item => `
        <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem; border-bottom: 1px solid #F1F5F9;">
          <span>${item.quantity}x ${item.name}</span>
          <span class="font-bold">${formatRupiah(item.subtotal || item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>

    <div style="background: #F8FAFC; padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Subtotal</span>
        <span class="font-bold">${formatRupiah(order.subtotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <span>Ongkir</span>
        <span class="font-bold">${formatRupiah(order.deliveryFee)}</span>
      </div>
      ${order.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; color: var(--success);">
          <span>Diskon Promo</span>
          <span class="font-bold">- ${formatRupiah(order.discount)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; border-top: 1px solid #CBD5E1; padding-top: 0.5rem; font-size: 1.05rem; font-weight: 800;">
        <span>Total Akhir</span>
        <span class="text-primary">${formatRupiah(order.total)}</span>
      </div>
      <p class="text-xs text-muted" style="margin-top: 0.5rem; text-align: right;">Metode Pembayaran: <strong>${order.paymentMethod}</strong></p>
    </div>
  `;

  openModal('adminInvoiceModal');
}

// ==========================================
// 7. LAPORAN PENJUALAN ADMIN
// ==========================================
function initLaporanAdmin() {
  renderLaporanSummary();
}

function renderLaporanSummary() {
  const orders = getOrders();
  const successfulOrders = orders.filter(o => o.status === 'Selesai');
  const activeOrders = orders.filter(o => !['Selesai', 'Dibatalkan'].includes(o.status));
  const cancelledOrders = orders.filter(o => o.status === 'Dibatalkan');

  const totalOmset = successfulOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const elOmset = document.getElementById('reportTotalOmset');
  const elSuccessCount = document.getElementById('reportSuccessCount');
  const elActiveCount = document.getElementById('reportActiveCount');
  const elCancelCount = document.getElementById('reportCancelCount');
  const tbody = document.getElementById('reportTableBody');

  if (elOmset) elOmset.textContent = formatRupiah(totalOmset);
  if (elSuccessCount) elSuccessCount.textContent = successfulOrders.length;
  if (elActiveCount) elActiveCount.textContent = activeOrders.length;
  if (elCancelCount) elCancelCount.textContent = cancelledOrders.length;

  if (tbody) {
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td class="font-bold">${order.id}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td>${order.customerName}</td>
        <td>${order.restoName}</td>
        <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
        <td>${order.paymentMethod}</td>
        <td><span class="status-badge status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></td>
      </tr>
    `).join('');
  }
}

// Export Report to CSV
function exportReportCSV() {
  const orders = getOrders();
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Kode Pesanan,Waktu,Pelanggan,Restoran,Total,Metode Pembayaran,Status\n";

  orders.forEach(o => {
    csvContent += `"${o.id}","${o.createdAt}","${o.customerName}","${o.restoName}","${o.total}","${o.paymentMethod}","${o.status}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Laporan_Penjualan_SajiCepat_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Laporan penjualan CSV berhasil diunduh.', 'success');
}
