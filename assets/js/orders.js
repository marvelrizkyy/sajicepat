/**
 * SAJICEPAT - CUSTOMER ORDER HISTORY & TRACKING
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

let activeOrderFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderCustomerOrders();
  setupOrderFilterTabs();
});

function setupOrderFilterTabs() {
  const tabs = document.querySelectorAll('.order-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeOrderFilter = tab.getAttribute('data-filter') || 'all';
      renderCustomerOrders();
    });
  });
}

function renderCustomerOrders() {
  const container = document.getElementById('customerOrdersContainer');
  const emptyState = document.getElementById('ordersEmptyState');
  if (!container) return;

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isRestrictedRole = user && (user.role === 'admin' || user.role === 'restoran');
  const roleLabel = isRestrictedRole ? (user.role === 'admin' ? 'Administrator' : 'Mitra Restoran') : '';
  const dashboardLink = user && user.role === 'admin' ? 'admin/dashboard.html' : 'restoran/dashboard.html';

  let roleNotice = document.getElementById('ordersRoleNotice');
  if (isRestrictedRole) {
    if (!roleNotice) {
      roleNotice = document.createElement('div');
      roleNotice.id = 'ordersRoleNotice';
      roleNotice.style.cssText = 'background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: #1E40AF;';
      container.parentNode.insertBefore(roleNotice, container);
    }
    roleNotice.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #DBEAFE; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #2563EB; flex-shrink: 0;">
          <i class="fa-solid fa-user-shield"></i>
        </div>
        <div>
          <strong style="font-size: 0.9rem; display: block; color: #1E3A8A;">Akun Pengelola (${roleLabel})</strong>
          <span style="font-size: 0.8rem; color: #3B82F6;">Halaman ini menampilkan riwayat pesanan pelanggan. Akun ${roleLabel} tidak dapat memesan makanan.</span>
        </div>
      </div>
      <a href="${dashboardLink}" class="btn btn-sm" style="background: #2563EB; color: #FFF; white-space: nowrap; font-weight: 600; padding: 0.45rem 0.9rem; font-size: 0.8rem; text-decoration: none; border-radius: var(--radius-sm);">
        <i class="fa-solid fa-gauge-high"></i> Buka Dashboard
      </a>
    `;
  } else if (roleNotice) {
    roleNotice.remove();
  }

  const allOrders = getOrders();

  // Filter orders for current logged-in customer (or show all if guest/demo)
  let userOrders = allOrders;
  if (user && user.role === 'pelanggan') {
    userOrders = allOrders.filter(o => o.customerEmail === user.email || !o.customerEmail);
  }

  // Filter by tab
  let filteredOrders = userOrders;
  if (activeOrderFilter === 'active') {
    filteredOrders = userOrders.filter(o => !['Selesai', 'Dibatalkan'].includes(o.status));
  } else if (activeOrderFilter === 'completed') {
    filteredOrders = userOrders.filter(o => o.status === 'Selesai');
  } else if (activeOrderFilter === 'cancelled') {
    filteredOrders = userOrders.filter(o => o.status === 'Dibatalkan');
  }

  if (filteredOrders.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = filteredOrders.map(order => {
    const statusSlug = (order.status || 'menunggu-konfirmasi').toLowerCase().replace(/\s+/g, '-');
    const canCancel = order.status === 'Menunggu konfirmasi';
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    const additionalItemsCount = order.items ? order.items.length - 1 : 0;

    return `
      <div class="panel-card" style="margin-bottom: 1.5rem; transition: var(--transition); border-radius: var(--radius-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="background: var(--primary-light); color: var(--primary-hover); width: 42px; height: 42px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <div>
              <span class="font-bold text-gray-900" style="font-size: 1.05rem;">${order.id}</span>
              <div class="text-xs text-muted" style="margin-top: 2px;">
                <span><i class="fa-regular fa-clock"></i> ${formatDate(order.createdAt)}</span> • 
                <span class="font-semibold text-gray-700"><i class="fa-solid fa-store text-orange-500"></i> ${order.restoName}</span>
              </div>
            </div>
          </div>
          <span class="status-badge status-${statusSlug}">
            ${order.status}
          </span>
        </div>

        <!-- Order Items Preview -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            ${firstItem ? `
              <img src="${firstItem.image}" alt="${firstItem.name}" style="width: 60px; height: 60px; border-radius: var(--radius-md); object-fit: cover;">
              <div>
                <h5 class="font-bold text-gray-900" style="font-size: 0.95rem;">${firstItem.name}</h5>
                <p class="text-xs text-muted">${firstItem.quantity} porsi x ${formatRupiah(firstItem.price)}</p>
                ${additionalItemsCount > 0 ? `
                  <span class="badge badge-primary" style="margin-top: 4px; font-size: 0.7rem;">+${additionalItemsCount} menu lainnya</span>
                ` : ''}
              </div>
            ` : ''}
          </div>
          <div style="text-align: right;">
            <span class="text-xs text-muted">Total Pembayaran</span>
            <h4 class="font-bold text-primary" style="font-size: 1.25rem;">${formatRupiah(order.total)}</h4>
            <span class="text-xs text-gray-500">${order.paymentMethod}</span>
          </div>
        </div>

        <!-- Action Row -->
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid #F1F5F9; padding-top: 1rem; margin-top: 1rem; flex-wrap: wrap;">
          ${canCancel ? `
            <button class="btn btn-secondary btn-sm text-danger" onclick="cancelOrderCustomer('${order.id}')">
              <i class="fa-solid fa-ban"></i> Batalkan Pesanan
            </button>
          ` : ''}
          ${order.status === 'Selesai' ? (
            order.hasReviewed ? `
              <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.85; cursor: default; background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;">
                <i class="fa-solid fa-circle-check"></i> Sudah Diulas
              </button>
            ` : `
              <button class="btn btn-warning btn-sm" onclick="openReviewOrderModal('${order.id}')" style="background: #F59E0B; color: #FFFFFF; border: none; font-weight: 700;">
                <i class="fa-solid fa-star"></i> Beri Ulasan
              </button>
            `
          ) : ''}
          <button class="btn btn-outline-primary btn-sm" onclick="showOrderDetailModal('${order.id}')">
            <i class="fa-solid fa-eye"></i> Detail & Lacak
          </button>
          ${isRestrictedRole ? `
            <button class="btn btn-secondary btn-sm" onclick="showToast('Akun ${roleLabel} tidak dapat memesan makanan. Silakan masuk sebagai Pelanggan!', 'warning', 4500)" style="opacity: 0.65; cursor: not-allowed;" title="Pemesanan hanya untuk akun Pelanggan">
              <i class="fa-solid fa-lock"></i> Pesan Lagi
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="reorderItems('${order.id}')">
              <i class="fa-solid fa-rotate-right"></i> Pesan Lagi
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// Show Detail & Timeline Stepper Modal
function showOrderDetailModal(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById('orderDetailModal');
  const content = document.getElementById('orderDetailModalContent');
  if (!modal || !content) return;

  const statusList = [
    'Menunggu konfirmasi',
    'Dikonfirmasi',
    'Sedang disiapkan',
    'Siap dikirim',
    'Dalam pengantaran',
    'Selesai'
  ];

  const currentStatusIndex = statusList.indexOf(order.status);
  const isCancelled = order.status === 'Dibatalkan';

  content.innerHTML = `
    <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span class="text-xs text-muted">Kode Pesanan</span>
          <h3 class="font-bold text-gray-900" style="font-size: 1.25rem;">${order.id}</h3>
        </div>
        <span class="status-badge status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}">
          ${order.status}
        </span>
      </div>
      <p class="text-xs text-muted" style="margin-top: 4px;">Waktu Pemesanan: <strong>${formatDate(order.createdAt)}</strong></p>
    </div>

    <!-- Tracking Stepper -->
    ${!isCancelled ? `
      <div class="order-tracking-stepper">
        ${statusList.map((step, idx) => {
          let stepClass = '';
          if (idx < currentStatusIndex) stepClass = 'completed';
          else if (idx === currentStatusIndex) stepClass = 'active';

          let icon = idx + 1;
          if (idx < currentStatusIndex) icon = '<i class="fa-solid fa-check"></i>';

          return `
            <div class="step-item ${stepClass}">
              <div class="step-circle">${icon}</div>
              <span class="step-title">${step}</span>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div style="background: #FEE2E2; border: 1px solid #FCA5A5; border-radius: var(--radius-md); padding: 1rem; color: #991B1B; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem;"></i>
        <div>
          <h5 class="font-bold">Pesanan Ini Telah Dibatalkan</h5>
          <p class="text-xs">Pesanan dibatalkan dan tidak diproses lebih lanjut.</p>
        </div>
      </div>
    `}

    <!-- Resto & Customer Info -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #FFF7ED; padding: 1rem; border-radius: var(--radius-md); margin: 1.5rem 0;">
      <div>
        <span class="text-xs font-bold text-primary" style="text-transform: uppercase;">Restoran</span>
        <h5 class="font-bold text-gray-900" style="font-size: 0.95rem;">${order.restoName}</h5>
      </div>
      <div>
        <span class="text-xs font-bold text-primary" style="text-transform: uppercase;">Alamat Pengiriman</span>
        <p class="text-xs text-gray-700" style="font-weight: 500;">${order.deliveryAddress}</p>
        <span class="text-xs text-muted"><i class="fa-solid fa-phone"></i> ${order.customerPhone}</span>
      </div>
    </div>

    ${order.orderNotes ? `
      <div style="margin-bottom: 1.25rem; background: #F8FAFC; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
        <span class="text-xs font-bold text-muted">Catatan Pelanggan:</span>
        <p class="text-xs text-gray-700" style="font-style: italic;">"${order.orderNotes}"</p>
      </div>
    ` : ''}

    <!-- Items Breakdown -->
    <h5 class="font-bold text-gray-900" style="margin-bottom: 0.75rem;">Rincian Menu</h5>
    <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.25rem;">
      ${(order.items || []).map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
            <div>
              <p class="font-semibold text-gray-900 text-xs">${item.name}</p>
              <span class="text-xs text-muted">${item.quantity} x ${formatRupiah(item.price)}</span>
            </div>
          </div>
          <span class="font-bold text-gray-900 text-xs">${formatRupiah(item.subtotal || item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>

    <!-- Pricing Summary -->
    <div style="background: #F8FAFC; padding: 1rem; border-radius: var(--radius-md);">
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
        <span class="text-muted">Subtotal</span>
        <span class="font-semibold">${formatRupiah(order.subtotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
        <span class="text-muted">Biaya Pengiriman</span>
        <span class="font-semibold">${formatRupiah(order.deliveryFee)}</span>
      </div>
      ${order.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem; color: var(--success);">
          <span>Diskon Promo</span>
          <span class="font-bold">- ${formatRupiah(order.discount)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 800; border-top: 1px solid #CBD5E1; padding-top: 0.65rem; margin-top: 0.5rem;">
        <span>Total Pembayaran</span>
        <span class="text-primary">${formatRupiah(order.total)}</span>
      </div>
      <div style="margin-top: 0.5rem; text-align: right; font-size: 0.75rem; color: var(--text-muted);">
        Metode: <strong>${order.paymentMethod}</strong>
      </div>
    </div>
  `;

  openModal('orderDetailModal');
}

// Cancel Order by customer
function cancelOrderCustomer(orderId) {
  if (confirm(`Apakah Anda yakin ingin membatalkan pesanan ${orderId}?`)) {
    let orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      if (order.status !== 'Menunggu konfirmasi') {
        showToast('Pesanan tidak dapat dibatalkan karena sudah diproses atau disiapkan oleh restoran.', 'error');
        return;
      }
      order.status = 'Dibatalkan';
      if (!order.history) order.history = [];
      const now = new Date();
      order.history.push({
        status: 'Dibatalkan',
        time: now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5)
      });
      saveOrders(orders);
      showToast(`Pesanan ${orderId} berhasil dibatalkan.`, 'info');
      renderCustomerOrders();
    }
  }
}

// Reorder items
function reorderItems(orderId) {
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'restoran')) {
    const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Mitra Restoran';
    showToast(`Akun ${roleLabel} tidak dapat memesan makanan. Silakan masuk sebagai Pelanggan!`, 'warning', 4500);
    return;
  }

  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.items || order.items.length === 0) return;

  let cart = getCart();
  order.items.forEach(item => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal = existing.quantity * existing.price;
    } else {
      cart.push({ ...item });
    }
  });

  saveCart(cart);
  updateCartBadge();
  showToast('Menu dari pesanan sebelumnya telah dimasukkan ke keranjang!', 'success');
  setTimeout(() => {
    window.location.href = 'keranjang.html';
  }, 800);
}

// ==========================================
// CUSTOMER ORDER REVIEWS
// ==========================================
let currentReviewRating = 5;

function setupOrderStarRatingPicker() {
  const picker = document.getElementById('orderStarRatingPicker');
  const ratingInput = document.getElementById('reviewRatingValue');
  const label = document.getElementById('starRatingLabel');
  if (!picker) return;

  const stars = picker.querySelectorAll('.star-item');
  const labels = {
    1: 'Kecewa (1 Bintang)',
    2: 'Kurang Puas (2 Bintang)',
    3: 'Cukup Baik (3 Bintang)',
    4: 'Puas & Enak (4 Bintang)',
    5: 'Sangat Puas & Lezat (5 Bintang)'
  };

  const updateStarsDisplay = (rating) => {
    stars.forEach(star => {
      const val = parseInt(star.getAttribute('data-rating'));
      if (val <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
    if (label) label.textContent = labels[rating] || `${rating} Bintang`;
    if (ratingInput) ratingInput.value = rating;
  };

  stars.forEach(star => {
    star.onclick = () => {
      currentReviewRating = parseInt(star.getAttribute('data-rating'));
      updateStarsDisplay(currentReviewRating);
    };

    star.onmouseenter = () => {
      const hoverVal = parseInt(star.getAttribute('data-rating'));
      stars.forEach(s => {
        const val = parseInt(s.getAttribute('data-rating'));
        if (val <= hoverVal) {
          s.classList.add('hovered');
        } else {
          s.classList.remove('hovered');
        }
      });
    };

    star.onmouseleave = () => {
      stars.forEach(s => s.classList.remove('hovered'));
    };
  });

  updateStarsDisplay(currentReviewRating);
}

function openReviewOrderModal(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('reviewOrderId').value = order.id;
  document.getElementById('reviewOrderRestoId').value = order.restoId || 1;
  document.getElementById('reviewRestoName').textContent = order.restoName;
  document.getElementById('reviewModalSubtitle').textContent = `Pesanan #${order.id} • ${order.restoName}`;
  document.getElementById('reviewCommentText').value = '';

  const select = document.getElementById('reviewItemSelect');
  if (select) {
    if (order.items && order.items.length > 0) {
      select.innerHTML = order.items.map(item => `
        <option value="${item.name}">${item.name} (${item.quantity} porsi)</option>
      `).join('') + `<option value="Seluruh Menu Pesanan">Seluruh Menu Pesanan</option>`;
    } else {
      select.innerHTML = `<option value="Pesanan Kuliner">Pesanan Kuliner</option>`;
    }
  }

  currentReviewRating = 5;
  setupOrderStarRatingPicker();
  openModal('orderReviewModal');
}

function submitOrderReview(e) {
  e.preventDefault();
  const orderId = document.getElementById('reviewOrderId').value;
  const restoId = parseInt(document.getElementById('reviewOrderRestoId').value) || 1;
  const rating = parseInt(document.getElementById('reviewRatingValue').value) || 5;
  const itemName = document.getElementById('reviewItemSelect').value || 'Pesanan Makanan';
  const comment = document.getElementById('reviewCommentText').value.trim();

  if (!comment) {
    showToast('Harap tuliskan ulasan pengalaman Anda.', 'warning');
    return;
  }

  const currentUser = getCurrentUser();
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);

  const reviewerName = currentUser ? currentUser.name : (order ? order.customerName : 'Pelanggan SajiCepat');
  const reviewerAvatar = (currentUser && currentUser.avatar) ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

  const newReview = {
    id: Date.now(),
    name: reviewerName,
    rating: rating,
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    comment: comment,
    avatar: reviewerAvatar,
    item: itemName,
    restoId: restoId,
    restoName: order ? order.restoName : 'Restoran SajiCepat',
    orderId: orderId
  };

  // 1. Save Review to sajicepat_reviews
  const reviews = getReviews();
  reviews.unshift(newReview);
  saveReviews(reviews);

  // 2. Mark order as reviewed
  if (order) {
    order.hasReviewed = true;
    saveOrders(orders);
  }

  // 3. Update restaurant review count and rating
  const restos = getRestaurants();
  const resto = restos.find(r => r.id === restoId);
  if (resto) {
    const currentCount = resto.reviewsCount || 10;
    const currentRating = resto.rating || 4.8;
    const newRating = Math.round(((currentRating * currentCount + rating) / (currentCount + 1)) * 10) / 10;
    resto.reviewsCount = currentCount + 1;
    resto.rating = newRating;
    saveRestaurants(restos);
  }

  closeModal('orderReviewModal');
  showToast('Terima kasih! Ulasan Anda berhasil dikirim dan kini tampil di beranda.', 'success', 3500);
  renderCustomerOrders();
}

