/**
 * SAJICEPAT - CHECKOUT & ORDER PLACEMENT SIMULATION
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

document.addEventListener('DOMContentLoaded', () => {
  initCheckoutPage();
});

function initCheckoutPage() {
  const checkoutItemsContainer = document.getElementById('checkoutItemsList');
  if (!checkoutItemsContainer) return; // not on checkout page

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  // Role Restriction: Admin and Restaurant cannot place orders
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'restoran')) {
    const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Mitra Restoran';
    
    // Disable submit button
    const submitBtn = document.getElementById('placeOrderSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.remove('btn-primary');
      submitBtn.classList.add('btn-secondary');
      submitBtn.style.opacity = '0.65';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = `<i class="fa-solid fa-ban"></i> Pemesanan Dibatasi (${roleLabel})`;
    }

    // Insert warning banner above checkout layout
    const checkoutContainer = document.querySelector('.checkout-grid');
    if (checkoutContainer && !document.getElementById('checkoutRoleWarning')) {
      const banner = document.createElement('div');
      banner.id = 'checkoutRoleWarning';
      banner.style.cssText = 'background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: #991B1B; box-shadow: var(--shadow-sm);';
      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #FEE2E2; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; color: #DC2626; flex-shrink: 0;">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 4px; color: #991B1B;">Akses Pemesanan Dibatasi</h4>
            <p style="font-size: 0.85rem; margin: 0; color: #B91C1C; line-height: 1.4;">
              Anda saat ini masuk sebagai <strong>${roleLabel}</strong> (${currentUser.name}). Akun pengelola tidak diizinkan melakukan transaksi pemesanan makanan. Silakan masuk menggunakan akun <strong>Pelanggan</strong>.
            </p>
          </div>
        </div>
        <a href="login.html" class="btn btn-sm" style="background: #DC2626; color: #FFF; white-space: nowrap; font-weight: 600; padding: 0.6rem 1.1rem; text-decoration: none; border-radius: var(--radius-sm);">
          <i class="fa-solid fa-right-left"></i> Masuk Akun Pelanggan
        </a>
      `;
      checkoutContainer.parentNode.insertBefore(banner, checkoutContainer);
    }

    showToast(`Akun ${roleLabel} tidak dapat memesan makanan. Silakan masuk sebagai Pelanggan!`, 'warning', 5000);
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Keranjang belanja Anda masih kosong. Silakan pilih menu terlebih dahulu.', 'warning');
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 1500);
    return;
  }

  // Pre-fill user information if logged in
  if (currentUser) {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const addressInput = document.getElementById('deliveryAddress');

    if (nameInput && !nameInput.value) nameInput.value = currentUser.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone || '';
    if (addressInput && !addressInput.value) addressInput.value = currentUser.address || '';
  }

  renderCheckoutSummary();
  setupPaymentMethodListeners();
}

function renderCheckoutSummary() {
  const itemsContainer = document.getElementById('checkoutItemsList');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const deliveryEl = document.getElementById('checkoutDeliveryFee');
  const discountRow = document.getElementById('checkoutDiscountRow');
  const discountEl = document.getElementById('checkoutDiscount');
  const totalEl = document.getElementById('checkoutTotal');

  const cart = getCart();
  const totals = getCartTotals();

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="checkout-item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #F1F5F9;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
          <div>
            <h5 class="font-bold text-gray-900" style="font-size: 0.88rem; margin-bottom: 2px;">${item.name}</h5>
            <span class="text-xs text-muted">${item.quantity} x ${formatRupiah(item.price)}</span>
          </div>
        </div>
        <span class="font-bold text-gray-900" style="font-size: 0.9rem;">${formatRupiah(item.subtotal)}</span>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = formatRupiah(totals.subtotal);
  if (deliveryEl) deliveryEl.textContent = formatRupiah(totals.deliveryFee);

  if (discountRow && discountEl) {
    if (totals.discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `- ${formatRupiah(totals.discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = formatRupiah(totals.total);
}

function setupPaymentMethodListeners() {
  const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const transferInfo = document.getElementById('transferBankInfo');
  const ewalletInfo = document.getElementById('ewalletInfo');

  methodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (transferInfo) transferInfo.style.display = radio.value === 'transfer' ? 'block' : 'none';
      if (ewalletInfo) ewalletInfo.style.display = radio.value === 'ewallet' ? 'block' : 'none';
    });
  });
}

// Handle Order Submission
function handleCheckoutSubmit(event) {
  event.preventDefault();

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'restoran')) {
    const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Mitra Restoran';
    showToast(`Akses Ditolak: Akun ${roleLabel} tidak diizinkan membuat pesanan makanan. Silakan masuk menggunakan akun Pelanggan!`, 'error', 5000);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Keranjang Anda kosong!', 'error');
    return;
  }

  const name = document.getElementById('customerName')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const address = document.getElementById('deliveryAddress')?.value.trim();
  const notes = document.getElementById('orderNotes')?.value.trim() || '';
  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value;

  if (!name || !phone || !address) {
    showToast('Mohon lengkapi nama penerima, nomor telepon, dan alamat pengantaran.', 'warning');
    return;
  }

  if (!selectedPayment) {
    showToast('Silakan pilih salah satu metode pembayaran simulasi.', 'warning');
    return;
  }

  let paymentMethodLabel = 'Tunai saat pengantaran (COD)';
  let paymentStatus = 'Menunggu Pembayaran saat Pengantaran';

  if (selectedPayment === 'transfer') {
    const bank = document.getElementById('bankSelect')?.value || 'BCA';
    paymentMethodLabel = `Transfer Bank (${bank}) - Simulasi`;
    paymentStatus = 'Lunas (Simulasi Transfer)';
  } else if (selectedPayment === 'ewallet') {
    const wallet = document.getElementById('walletSelect')?.value || 'GoPay';
    paymentMethodLabel = `Dompet Digital (${wallet}) - Simulasi QRIS`;
    paymentStatus = 'Lunas (Simulasi E-Wallet)';
  }

  // Generate Unique Order Code SJC-YYYYMMDD-XXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderCode = `SJC-${dateStr}-${randomSuffix}`;

  const totals = getCartTotals();

  // Create new order object
  const newOrder = {
    id: orderCode,
    customerName: name,
    customerEmail: currentUser ? currentUser.email : 'tamu@sajicepat.com',
    customerPhone: phone,
    deliveryAddress: address,
    orderNotes: notes,
    restoId: cart[0].restoId || 1,
    restoName: cart[0].restoName || 'Restoran SajiCepat',
    items: [...cart],
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    discount: totals.discount,
    total: totals.total,
    paymentMethod: paymentMethodLabel,
    paymentStatus: paymentStatus,
    status: 'Menunggu konfirmasi',
    createdAt: now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5),
    history: [
      {
        status: 'Menunggu konfirmasi',
        time: now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5)
      }
    ]
  };

  // Save to LocalStorage
  const orders = getOrders();
  orders.unshift(newOrder);
  saveOrders(orders);

  // Clear cart & voucher
  saveCart([]);
  localStorage.removeItem('sajicepat_voucher');
  updateCartBadge();

  // Open Order Success Modal
  const successModal = document.getElementById('orderSuccessModal');
  const successOrderCode = document.getElementById('successOrderCode');
  const successTotal = document.getElementById('successTotal');

  if (successModal && successOrderCode && successTotal) {
    successOrderCode.textContent = orderCode;
    successTotal.textContent = formatRupiah(totals.total);
    openModal('orderSuccessModal');
  } else {
    showToast(`Pesanan ${orderCode} berhasil dibuat!`, 'success');
    setTimeout(() => {
      window.location.href = 'pesanan.html';
    }, 1200);
  }
}
