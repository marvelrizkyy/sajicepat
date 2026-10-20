/**
 * SAJICEPAT - SHOPPING CART LOGIC
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 */

// Active voucher code applied in session
let currentVoucher = localStorage.getItem('sajicepat_voucher') || null;

// Add item to cart
function addToCart(menuId, quantity = 1) {
  // Restriction: Admin and Restaurant roles cannot order food
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'restoran')) {
    const roleLabel = currentUser.role === 'admin' ? 'Administrator' : 'Mitra Restoran';
    showToast(`Akun ${roleLabel} tidak dapat memesan makanan. Silakan masuk menggunakan akun Pelanggan!`, 'warning', 4500);
    return false;
  }

  const menus = getMenus();
  const menu = menus.find(m => m.id === parseInt(menuId));

  if (!menu) {
    showToast('Menu makanan tidak ditemukan.', 'error');
    return false;
  }

  if (!menu.isAvailable || menu.stock <= 0) {
    showToast(`Maaf, ${menu.name} sedang habis.`, 'warning');
    return false;
  }

  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === menu.id);

  if (existingItemIndex > -1) {
    const newQty = cart[existingItemIndex].quantity + quantity;
    if (newQty > menu.stock) {
      showToast(`Stok maksimal yang tersedia hanya ${menu.stock}.`, 'warning');
      return false;
    }
    cart[existingItemIndex].quantity = newQty;
    cart[existingItemIndex].subtotal = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
  } else {
    if (quantity > menu.stock) {
      showToast(`Stok maksimal yang tersedia hanya ${menu.stock}.`, 'warning');
      return false;
    }
    cart.push({
      id: menu.id,
      name: menu.name,
      restoId: menu.restoId,
      restoName: menu.restoName,
      category: menu.category,
      price: menu.price,
      image: menu.image,
      quantity: quantity,
      subtotal: menu.price * quantity
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`Berhasil menambahkan ${quantity}x "${menu.name}" ke keranjang!`, 'success');
  return true;
}

// Remove item completely from cart
function removeFromCart(menuId) {
  let cart = getCart();
  const item = cart.find(i => i.id === parseInt(menuId));
  const itemName = item ? item.name : 'Makanan';

  cart = cart.filter(i => i.id !== parseInt(menuId));
  saveCart(cart);
  updateCartBadge();

  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
  showToast(`"${itemName}" telah dihapus dari keranjang.`, 'info');
}

// Update specific item quantity
function updateCartItemQuantity(menuId, newQuantity) {
  let cart = getCart();
  const index = cart.findIndex(i => i.id === parseInt(menuId));

  if (index === -1) return;

  const menus = getMenus();
  const menu = menus.find(m => m.id === parseInt(menuId));
  const maxStock = menu ? menu.stock : 99;

  if (newQuantity <= 0) {
    removeFromCart(menuId);
    return;
  }

  if (newQuantity > maxStock) {
    showToast(`Jumlah melebihi stok yang tersedia (${maxStock} porsi).`, 'warning');
    return;
  }

  cart[index].quantity = newQuantity;
  cart[index].subtotal = cart[index].quantity * cart[index].price;

  saveCart(cart);
  updateCartBadge();

  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

// Calculate cart totals
function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
  
  // Delivery fee is 8000 default or 0 if cart empty
  const deliveryFee = cart.length > 0 ? 8000 : 0;

  let discount = 0;
  if (currentVoucher === 'SAJICEPATHEMAT' && subtotal > 0) {
    discount = Math.min(20000, Math.round(subtotal * 0.20)); // 20% discount max 20rb
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  return {
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    deliveryFee,
    discount,
    voucherCode: currentVoucher,
    total
  };
}

// Apply voucher promo code
function applyPromoCode(code) {
  const trimmed = (code || '').trim().toUpperCase();
  if (!trimmed) {
    showToast('Masukkan kode promo terlebih dahulu.', 'warning');
    return;
  }

  if (trimmed === 'SAJICEPATHEMAT' || trimmed === 'DISKON20') {
    currentVoucher = 'SAJICEPATHEMAT';
    localStorage.setItem('sajicepat_voucher', currentVoucher);
    showToast('Kode promo berhasil digunakan! Diskon 20% telah diterapkan.', 'success');
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  } else {
    showToast('Kode promo tidak valid atau telah kedaluwarsa. Coba "SAJICEPATHEMAT".', 'error');
  }
}

// Render Cart Page DOM
function renderCartPage() {
  const cartTableBody = document.getElementById('cartTableBody');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartContentWrapper = document.getElementById('cartContentWrapper');
  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDeliveryFee');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const totalEl = document.getElementById('cartTotal');
  const voucherInput = document.getElementById('voucherInput');

  if (!cartTableBody || !cartEmptyState || !cartContentWrapper) return;

  const cart = getCart();
  const totals = getCartTotals();

  if (cart.length === 0) {
    cartContentWrapper.style.display = 'none';
    cartEmptyState.style.display = 'block';
    return;
  }

  cartContentWrapper.style.display = 'grid';
  cartEmptyState.style.display = 'none';

  cartTableBody.innerHTML = cart.map(item => `
    <tr>
      <td>
        <div class="table-user-info">
          <img src="${item.image}" alt="${item.name}" class="table-food-img">
          <div>
            <h4 class="font-bold text-gray-900" style="font-size: 0.95rem;">${item.name}</h4>
            <span class="text-xs text-muted"><i class="fa-solid fa-store text-orange-500"></i> ${item.restoName}</span>
          </div>
        </div>
      </td>
      <td class="font-semibold">${formatRupiah(item.price)}</td>
      <td>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" title="Kurangi">−</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})" title="Tambah">+</button>
        </div>
      </td>
      <td class="font-bold text-primary">${formatRupiah(item.subtotal)}</td>
      <td>
        <button class="btn-table-action btn-delete" onclick="removeFromCart(${item.id})" title="Hapus Makanan">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');

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
  if (voucherInput && totals.voucherCode) voucherInput.value = totals.voucherCode;

  // Role Restriction Check: Admin and Restaurant cannot checkout
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isRestrictedRole = currentUser && (currentUser.role === 'admin' || currentUser.role === 'restoran');
  const roleLabel = isRestrictedRole ? (currentUser.role === 'admin' ? 'Administrator' : 'Mitra Restoran') : '';

  let restrictionNotice = document.getElementById('cartRoleRestrictionNotice');
  if (isRestrictedRole) {
    if (!restrictionNotice) {
      restrictionNotice = document.createElement('div');
      restrictionNotice.id = 'cartRoleRestrictionNotice';
      restrictionNotice.style.cssText = 'grid-column: 1 / -1; background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: #991B1B;';
      cartContentWrapper.insertBefore(restrictionNotice, cartContentWrapper.firstChild);
    }
    restrictionNotice.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #FEE2E2; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #DC2626; flex-shrink: 0;">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <strong style="font-size: 0.9rem; display: block; color: #991B1B;">Akses Pemesanan Dibatasi</strong>
          <span style="font-size: 0.8rem; color: #B91C1C;">Anda sedang masuk sebagai <strong>${roleLabel}</strong> (${currentUser.name}). Akun pengelola tidak diizinkan membuat pesanan makanan.</span>
        </div>
      </div>
      <a href="login.html" class="btn btn-sm" style="background: #DC2626; color: #FFF; white-space: nowrap; font-weight: 600; padding: 0.45rem 0.9rem; font-size: 0.8rem; text-decoration: none; border-radius: var(--radius-sm);">
        Ganti Akun
      </a>
    `;
  } else if (restrictionNotice) {
    restrictionNotice.remove();
  }

  // Handle Checkout button state
  const proceedBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedBtn) {
    if (isRestrictedRole) {
      proceedBtn.classList.remove('btn-primary');
      proceedBtn.classList.add('btn-secondary');
      proceedBtn.style.opacity = '0.65';
      proceedBtn.style.cursor = 'not-allowed';
      proceedBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Pemesanan Dibatasi (${roleLabel})`;
      proceedBtn.onclick = (e) => {
        e.preventDefault();
        showToast(`Akun ${roleLabel} tidak dapat melakukan checkout makanan. Silakan masuk menggunakan akun Pelanggan!`, 'warning', 4500);
        return false;
      };
    } else {
      proceedBtn.classList.remove('btn-secondary');
      proceedBtn.classList.add('btn-primary');
      proceedBtn.style.opacity = '1';
      proceedBtn.style.cursor = 'pointer';
      proceedBtn.innerHTML = `Lanjut ke Pembayaran <i class="fa-solid fa-arrow-right"></i>`;
      proceedBtn.onclick = null;
    }
  }
}
