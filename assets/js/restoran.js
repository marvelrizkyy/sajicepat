/**
 * SAJICEPAT - RESTORAN DASHBOARD & MANAGEMENT CONTROLLER
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

// Determine currently active restaurant context
function getActiveResto() {
  const user = getCurrentUser();
  const restos = getRestaurants();

  if (user && user.role === 'restoran' && user.restoId) {
    const matched = restos.find(r => r.id === user.restoId);
    if (matched) return matched;
  }
  // Default to Ayam Geprek Juara Nusantara (ID: 1) for demo
  return restos[0];
}

document.addEventListener('DOMContentLoaded', () => {
  setupSidebarToggle();
  renderRestoHeaderInfo();

  const path = window.location.pathname;
  if (path.includes('dashboard.html') || path.endsWith('/restoran/')) {
    initRestoDashboard();
  } else if (path.includes('menu.html')) {
    initRestoMenuManagement();
  } else if (path.includes('pesanan.html')) {
    initRestoPesanan();
  } else if (path.includes('laporan.html')) {
    initRestoLaporan();
  } else if (path.includes('profil.html')) {
    initRestoProfil();
  }
});

function setupSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('dashboardSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }
}

function renderRestoHeaderInfo() {
  const activeResto = getActiveResto();
  const nameEls = document.querySelectorAll('.active-resto-name');
  nameEls.forEach(el => el.textContent = activeResto.name);
}

// ==========================================
// 1. RESTORAN DASHBOARD
// ==========================================
function initRestoDashboard() {
  const activeResto = getActiveResto();
  const allMenus = getMenus();
  const restoMenus = allMenus.filter(m => m.restoId === activeResto.id);
  const allOrders = getOrders();
  const restoOrders = allOrders.filter(o => o.restoId === activeResto.id);

  const incomingOrders = restoOrders.filter(o => ['Menunggu konfirmasi', 'Dikonfirmasi', 'Sedang disiapkan'].includes(o.status));
  const completedOrders = restoOrders.filter(o => o.status === 'Selesai');
  const totalOmset = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const elMenuCount = document.getElementById('restoStatMenuCount');
  const elIncomingCount = document.getElementById('restoStatIncomingCount');
  const elCompletedCount = document.getElementById('restoStatCompletedCount');
  const elOmset = document.getElementById('restoStatOmset');

  if (elMenuCount) elMenuCount.textContent = restoMenus.length;
  if (elIncomingCount) elIncomingCount.textContent = incomingOrders.length;
  if (elCompletedCount) elCompletedCount.textContent = completedOrders.length;
  if (elOmset) elOmset.textContent = formatRupiah(totalOmset);

  // Render incoming table
  const tbody = document.getElementById('restoIncomingOrdersTableBody');
  if (tbody) {
    if (incomingOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Belum ada pesanan aktif saat ini.</td></tr>`;
    } else {
      tbody.innerHTML = incomingOrders.map(order => {
        const statusSlug = (order.status || '').toLowerCase().replace(/\s+/g, '-');
        return `
          <tr>
            <td class="font-bold text-gray-900">${order.id}</td>
            <td class="font-semibold text-xs">${order.customerName}</td>
            <td class="text-xs text-muted">${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
            <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
            <td><span class="status-badge status-${statusSlug}">${order.status}</span></td>
            <td>
              <a href="pesanan.html" class="btn btn-outline-primary btn-sm">
                <i class="fa-solid fa-arrows-rotate"></i> Proses
              </a>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Resto Chart
  renderRestoChart();
}

function renderRestoChart() {
  const ctx = document.getElementById('restoSalesChart')?.getContext('2d');
  if (ctx && typeof Chart !== 'undefined') {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [{
          label: 'Pendapatan Resto (Rp Ribu)',
          data: [85, 140, 160, 110, 220, 310, 390],
          backgroundColor: '#F97316',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => 'Rp ' + v + 'k' }
          }
        }
      }
    });
  }
}

// ==========================================
// 2. RESTORAN MENU MANAGEMENT
// ==========================================
function initRestoMenuManagement() {
  renderRestoMenuTable();

  const searchInput = document.getElementById('searchRestoMenuInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderRestoMenuTable(e.target.value);
    });
  }

  const form = document.getElementById('restoMenuForm');
  if (form) {
    form.addEventListener('submit', handleSaveRestoMenu);
  }
}

function renderRestoMenuTable(searchQuery = '') {
  const tbody = document.getElementById('restoMenuTableBody');
  if (!tbody) return;

  const activeResto = getActiveResto();
  let menus = getMenus().filter(m => m.restoId === activeResto.id);
  const q = searchQuery.toLowerCase().trim();

  if (q) {
    menus = menus.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }

  if (menus.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Belum ada menu makanan yang terdaftar untuk restoran Anda.</td></tr>`;
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
            <span class="text-xs text-muted">${menu.category}</span>
          </div>
        </div>
      </td>
      <td class="font-bold text-primary">${formatRupiah(menu.price)}</td>
      <td class="text-xs font-semibold">${menu.stock} porsi</td>
      <td>
        <button class="status-badge ${menu.isAvailable ? 'status-tersedia' : 'status-habis'}" onclick="toggleRestoMenuStatus(${menu.id})" style="cursor: pointer; border: none;" title="Ubah status ketersediaan">
          ${menu.isAvailable ? 'Tersedia' : 'Habis'}
        </button>
      </td>
      <td class="text-xs"><i class="fa-solid fa-star text-warning"></i> ${menu.rating} (${menu.soldCount} terjual)</td>
      <td>
        <div class="action-btns">
          <button class="btn-table-action btn-edit" onclick="openEditRestoMenuModal(${menu.id})" title="Edit Menu">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-table-action btn-delete" onclick="deleteRestoMenu(${menu.id})" title="Hapus Menu">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddRestoMenuModal() {
  document.getElementById('restoMenuModalTitle').textContent = 'Tambah Menu Baru Restoran';
  document.getElementById('restoMenuId').value = '';
  document.getElementById('restoMenuName').value = '';
  document.getElementById('restoMenuCategory').value = 'Makanan berat';
  document.getElementById('restoMenuPrice').value = '';
  document.getElementById('restoMenuStock').value = '25';
  document.getElementById('restoMenuImage').value = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
  document.getElementById('restoMenuDesc').value = '';
  document.getElementById('restoMenuAvailable').checked = true;
  openModal('restoMenuModal');
}

function openEditRestoMenuModal(id) {
  const menus = getMenus();
  const m = menus.find(item => item.id === id);
  if (!m) return;

  document.getElementById('restoMenuModalTitle').textContent = 'Edit Menu Restoran';
  document.getElementById('restoMenuId').value = m.id;
  document.getElementById('restoMenuName').value = m.name;
  document.getElementById('restoMenuCategory').value = m.category;
  document.getElementById('restoMenuPrice').value = m.price;
  document.getElementById('restoMenuStock').value = m.stock;
  document.getElementById('restoMenuImage').value = m.image;
  document.getElementById('restoMenuDesc').value = m.description;
  document.getElementById('restoMenuAvailable').checked = m.isAvailable;
  openModal('restoMenuModal');
}

function handleSaveRestoMenu(e) {
  e.preventDefault();
  const id = document.getElementById('restoMenuId').value;
  const name = document.getElementById('restoMenuName').value.trim();
  const category = document.getElementById('restoMenuCategory').value;
  const price = parseInt(document.getElementById('restoMenuPrice').value) || 0;
  const stock = parseInt(document.getElementById('restoMenuStock').value) || 0;
  const image = document.getElementById('restoMenuImage').value.trim();
  const description = document.getElementById('restoMenuDesc').value.trim();
  const isAvailable = document.getElementById('restoMenuAvailable').checked;

  const activeResto = getActiveResto();
  let menus = getMenus();

  if (id) {
    const idx = menus.findIndex(m => m.id === parseInt(id));
    if (idx > -1) {
      menus[idx].name = name;
      menus[idx].category = category;
      menus[idx].price = price;
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
      restoId: activeResto.id,
      restoName: activeResto.name,
      category,
      price,
      originalPrice: price,
      rating: 4.8,
      soldCount: 0,
      stock,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      description,
      isAvailable
    };
    menus.push(newMenu);
    saveMenus(menus);
    showToast('Menu makanan baru berhasil ditambahkan ke restoran Anda!', 'success');
  }

  closeModal('restoMenuModal');
  renderRestoMenuTable();
}

function toggleRestoMenuStatus(id) {
  let menus = getMenus();
  const m = menus.find(item => item.id === id);
  if (m) {
    m.isAvailable = !m.isAvailable;
    saveMenus(menus);
    showToast(`Status "${m.name}" kini: ${m.isAvailable ? 'Tersedia' : 'Habis'}.`, 'info');
    renderRestoMenuTable();
  }
}

function deleteRestoMenu(id) {
  if (confirm('Apakah Anda yakin ingin menghapus menu ini dari daftar restoran Anda?')) {
    let menus = getMenus();
    menus = menus.filter(m => m.id !== id);
    saveMenus(menus);
    showToast('Menu berhasil dihapus.', 'info');
    renderRestoMenuTable();
  }
}

// ==========================================
// 3. RESTORAN PESANAN MASUK
// ==========================================
function initRestoPesanan() {
  renderRestoOrdersTable();

  const filter = document.getElementById('filterRestoOrderStatus');
  if (filter) {
    filter.addEventListener('change', (e) => {
      renderRestoOrdersTable(e.target.value);
    });
  }
}

function renderRestoOrdersTable(statusFilter = 'all') {
  const tbody = document.getElementById('restoOrdersTableBody');
  if (!tbody) return;

  const activeResto = getActiveResto();
  let orders = getOrders().filter(o => o.restoId === activeResto.id);

  if (statusFilter !== 'all') {
    orders = orders.filter(o => o.status === statusFilter);
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Tidak ada pesanan dengan status ini.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const statusSlug = (order.status || '').toLowerCase().replace(/\s+/g, '-');
    let nextActionBtn = '';

    if (order.status === 'Menunggu konfirmasi') {
      nextActionBtn = `
        <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus('${order.id}', 'Dikonfirmasi')">
          <i class="fa-solid fa-check"></i> Konfirmasi
        </button>
      `;
    } else if (order.status === 'Dikonfirmasi') {
      nextActionBtn = `
        <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus('${order.id}', 'Sedang disiapkan')">
          <i class="fa-solid fa-fire-burner"></i> Siapkan
        </button>
      `;
    } else if (order.status === 'Sedang disiapkan') {
      nextActionBtn = `
        <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus('${order.id}', 'Siap dikirim')">
          <i class="fa-solid fa-bell-concierge"></i> Siap Kirim
        </button>
      `;
    } else if (order.status === 'Siap dikirim') {
      nextActionBtn = `
        <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus('${order.id}', 'Dalam pengantaran')">
          <i class="fa-solid fa-motorcycle"></i> Serahkan Kurir
        </button>
      `;
    } else if (order.status === 'Dalam pengantaran') {
      nextActionBtn = `
        <button class="btn btn-outline-primary btn-sm" onclick="advanceOrderStatus('${order.id}', 'Selesai')">
          <i class="fa-solid fa-circle-check"></i> Tandai Selesai
        </button>
      `;
    }

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
        <td class="text-xs">
          ${order.items.map(i => `${i.quantity}x ${i.name}`).join('<br>')}
        </td>
        <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
        <td><span class="status-badge status-${statusSlug}">${order.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${nextActionBtn}
            <button class="btn-table-action btn-view" onclick="openRestoOrderInvoice('${order.id}')" title="Detail Invoice">
              <i class="fa-solid fa-file-invoice"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openRestoOrderInvoice(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const content = document.getElementById('restoInvoiceContent');
  if (!content) return;

  content.innerHTML = `
    <div style="border-bottom: 2px dashed #E2E8F0; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 class="font-bold text-gray-900" style="font-size: 1.35rem;">STRUK PESANAN MITRA</h3>
          <p class="text-xs text-muted">SajiCepat Partner Delivery</p>
        </div>
        <span class="status-badge status-${(order.status || '').toLowerCase().replace(/\\s+/g, '-')}">${order.status}</span>
      </div>
      <div style="margin-top: 1rem; font-size: 0.85rem; line-height: 1.5;">
        <p>Kode: <strong>${order.id}</strong></p>
        <p>Waktu: <strong>${formatDate(order.createdAt)}</strong></p>
        <p>Pelanggan: <strong>${order.customerName}</strong> (${order.customerPhone})</p>
        <p>Alamat Kirim: <strong>${order.deliveryAddress}</strong></p>
        ${order.orderNotes ? `<p style="color: var(--primary); font-style: italic;">Catatan: "${order.orderNotes}"</p>` : ''}
      </div>
    </div>

    <h5 class="font-bold text-gray-900 mb-2">Item Menu Dipesan:</h5>
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
      <p class="text-xs text-muted" style="margin-top: 0.5rem; text-align: right;">Metode: <strong>${order.paymentMethod}</strong></p>
    </div>
  `;

  openModal('restoInvoiceModal');
}

function advanceOrderStatus(orderId, newStatus) {
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
    showToast(`Status pesanan ${orderId} diperbarui: "${newStatus}"`, 'success');
    renderRestoOrdersTable();
  }
}

// ==========================================
// 4. RESTORAN LAPORAN PENJUALAN
// ==========================================
function initRestoLaporan() {
  const activeResto = getActiveResto();
  const orders = getOrders().filter(o => o.restoId === activeResto.id);
  const completed = orders.filter(o => o.status === 'Selesai');
  const totalOmset = completed.reduce((sum, o) => sum + (o.total || 0), 0);

  const elOmset = document.getElementById('restoReportOmset');
  const elTotalOrders = document.getElementById('restoReportTotalOrders');
  const tbody = document.getElementById('restoReportTableBody');

  if (elOmset) elOmset.textContent = formatRupiah(totalOmset);
  if (elTotalOrders) elTotalOrders.textContent = orders.length;

  if (tbody) {
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td class="font-bold">${order.id}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td>${order.customerName}</td>
        <td>${order.items.reduce((sum, i) => sum + i.quantity, 0)} menu</td>
        <td class="font-bold text-primary">${formatRupiah(order.total)}</td>
        <td><span class="status-badge status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></td>
      </tr>
    `).join('');
  }
}

// ==========================================
// 5. RESTORAN PROFIL MITRA
// ==========================================
function initRestoProfil() {
  const activeResto = getActiveResto();

  const nameInput = document.getElementById('profileRestoName');
  const categoryInput = document.getElementById('profileRestoCategory');
  const phoneInput = document.getElementById('profileRestoPhone');
  const hoursInput = document.getElementById('profileRestoHours');
  const feeInput = document.getElementById('profileRestoDeliveryFee');
  const addressInput = document.getElementById('profileRestoAddress');
  const imageInput = document.getElementById('profileRestoImage');
  const descInput = document.getElementById('profileRestoDesc');
  const previewImg = document.getElementById('profileRestoPreviewImg');

  if (nameInput) nameInput.value = activeResto.name;
  if (categoryInput) categoryInput.value = activeResto.category;
  if (phoneInput) phoneInput.value = activeResto.phone;
  if (hoursInput) hoursInput.value = activeResto.operationalHours;
  if (feeInput) feeInput.value = activeResto.deliveryFee;
  if (addressInput) addressInput.value = activeResto.address;
  if (imageInput) imageInput.value = activeResto.image;
  if (descInput) descInput.value = activeResto.description;
  if (previewImg) previewImg.src = activeResto.image;

  const form = document.getElementById('restoProfileForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let restos = getRestaurants();
      const idx = restos.findIndex(r => r.id === activeResto.id);
      if (idx > -1) {
        restos[idx].name = nameInput.value.trim();
        restos[idx].category = categoryInput.value;
        restos[idx].phone = phoneInput.value.trim();
        restos[idx].operationalHours = hoursInput.value.trim();
        restos[idx].deliveryFee = parseInt(feeInput.value) || 8000;
        restos[idx].address = addressInput.value.trim();
        restos[idx].image = imageInput.value.trim();
        restos[idx].description = descInput.value.trim();

        saveRestaurants(restos);
        showToast('Profil restoran berhasil diperbarui ke LocalStorage!', 'success');
        renderRestoHeaderInfo();
      }
    });
  }
}
