# 🍽️ SajiCepat - Aplikasi Pemesanan Makanan Online
> **Laporan Proyek Web Frontend Kelas XII Rekayasa Perangkat Lunak (RPL)**  
> Dibangun dengan **HTML5**, **CSS3 Murni**, dan **JavaScript Native (Vanilla JS)** tanpa framework eksternal. Seluruh penyimpanan data bersifat simulasi interaktif menggunakan **LocalStorage** browser.

---

## 📌 1. Deskripsi Aplikasi

**SajiCepat** adalah platform pemesanan makanan online modern yang dirancang untuk menghubungkan pelanggan dengan berbagai gerai kuliner nusantara. Website ini menyajikan antarmuka visual yang modern, responsif, dan kaya fitur interaktif dengan 3 jenis portal pengguna:
1. **Portal Pelanggan:** Eksplorasi menu, pencarian instan, filter kategori, keranjang belanja, simulasi pembayaran, pelacakan status pesanan, dan manajemen profil.
2. **Portal Mitra Restoran:** Pengelolaan katalog menu gerai, pengaturan ketersediaan/stok, penerimaan pesanan masuk, pembaruan tahapan memasak, laporan pendapatan, dan profil resto.
3. **Portal Administrator:** Ringkasan statistik performa aplikasi, grafik analitik penjualan dengan Chart.js, manajemen CRUD pelanggan, CRUD restoran, CRUD kategori, CRUD menu, dan rekapitulasi laporan transaksi dengan ekspor CSV.

---

## 🚀 2. Cara Menjalankan Aplikasi

Aplikasi ini bersifat murni frontend dan **tidak memerlukan instalasi Apache/PHP/MySQL**:

### Opsi A: Menggunakan Live Server di Visual Studio Code (Direkomendasikan)
1. Buka folder proyek `sajicepatt` di **Visual Studio Code**.
2. Klik kanan pada file `index.html`.
3. Pilih **"Open with Live Server"**.
4. Website akan otomatis terbuka di browser pada alamat `http://127.0.0.1:5500/index.html`.

### Opsi B: Membuka Langsung di Browser
1. Buka File Explorer di komputer Anda.
2. Masuk ke folder `c:\xampp_baru\htdocs\sajicepatt`.
3. Klik ganda (double-click) pada file [index.html](file:///c:/xampp_baru/htdocs/sajicepatt/index.html) untuk membukanya di Google Chrome, Microsoft Edge, atau Mozilla Firefox.

---

## 🔑 3. Akun Demo & Simulasi Peran Pengguna

Untuk kemudahan pengujian dan penilaian oleh penguji/guru, disediakan tombol **"Akun Demo Sekali Klik"** di halaman [login.html](file:///c:/xampp_baru/htdocs/sajicepatt/login.html) serta widget melayang (**Demo Role Switcher**) di pojok kanan bawah seluruh halaman:

| Peran (Role) | Email Demo | Password Demo | Hak Akses Utama |
|---|---|---|---|
| **Pelanggan** | `budi@gmail.com` | `password123` | Pesan makanan, keranjang, checkout, riwayat pesanan, profil. |
| **Mitra Restoran** | `resto@sajicepat.com` | `password123` | Dashboard gerai, kelola menu sendiri, terima & proses pesanan. |
| **Administrator** | `admin@sajicepat.com` | `admin` | Kontrol penuh sistem, CRUD pelanggan/resto/kategori/menu/pesanan, grafik analitik. |

> ℹ️ *Catatan Keamanan:* Autentikasi dan transaksi adalah simulasi frontend berbasis LocalStorage untuk keperluan tugas/portofolio sekolah, bukan sistem produksi dengan backend database.

---

## 📂 4. Struktur Folder & Berkas

```
sajicepat/
├── index.html              # Halaman beranda utama pelanggan (Hero, Promo, Kategori, Populer)
├── login.html              # Halaman autentikasi masuk dengan fitur 1-click demo switcher
├── register.html           # Formulir pendaftaran akun pelanggan baru
├── menu.html               # Katalog lengkap menu dengan pencarian live & multi-filter
├── detail-menu.html        # Halaman detail hidangan, deskripsi, porsi, dan rekomendasi
├── keranjang.html          # Keranjang belanja, ubah kuantiti, subtotal, & kode voucher
├── checkout.html           # Checkout formulir pengiriman & simulasi metode pembayaran
├── pesanan.html            # Riwayat pesanan pelanggan dengan stepper timeline pelacakan
├── profil.html             # Manajemen profil pelanggan dan statistik belanja
├── README.md               # Dokumentasi panduan teknis proyek
├── admin/                  # Portal Administrator
│   ├── dashboard.html      # Ringkasan analitik, metrik omset, grafik Chart.js
│   ├── pelanggan.html      # CRUD data pelanggan terdaftar
│   ├── restoran.html       # CRUD data mitra restoran kuliner
│   ├── kategori.html       # CRUD kategori makanan & ikon
│   ├── menu.html           # CRUD seluruh menu makanan & ketersediaan stok
│   ├── pesanan.html        # CRUD status pesanan & cetak invoice
│   └── laporan.html        # Rekapitulasi keuangan & ekspor data ke CSV
├── restoran/               # Portal Mitra Restoran
│   ├── dashboard.html      # Ringkasan gerai, pesanan aktif & grafik penjualan mingguan
│   ├── menu.html           # Manajemen menu khusus gerai mitra & saklar status
│   ├── pesanan.html        # Pemrosesan pesanan masuk (Konfirmasi -> Masak -> Siap Kirim)
│   ├── laporan.html        # Rekap omset pendapatan restoran mitra
│   └── profil.html         # Pengaturan identitas gerai, jam buka & banner
└── assets/
    ├── css/
    │   ├── style.css       # Sistem desain utama (warna, tipografi, grid, badge, modal)
    │   ├── auth.css        # Gaya tata letak halaman login & registrasi
    │   └── dashboard.css   # Tata letak sidebar, topbar, tabel data, & stepper
    ├── js/
    │   ├── data.js         # Inisialisasi seed database LocalStorage & model data
    │   ├── app.js          # Utilitas global (Rupiah, tanggal, toast, role switcher)
    │   ├── auth.js         # Validasi login, register, dan pengisian kredensial otomatis
    │   ├── cart.js         # Logika keranjang belanja, voucher diskon, & total harga
    │   ├── checkout.js     # Validasi formulir, generate kode pesanan unik, & modal sukses
    │   ├── orders.js       # Filter tab pesanan, pelacakan timeline, batal & pesan lagi
    │   ├── admin.js        # Logika analitik Chart.js & fungsi CRUD administrator
    │   └── restoran.js     # Logika operasional restoran & pergeseran status pesanan
    └── images/
        ├── logo.svg        # Identitas visual vektor brand SajiCepat
        └── logo.png        # Cadangan aset logo
```

---

## 🎯 5. Fitur Unggulan & Panduan Uji Coba

1. **Pencarian Real-Time & Filter Dinamis:**
   - Buka `menu.html`, ketikkan nama makanan seperti *"Ayam"*, *"Kopi"*, atau *"Padang"* di kolom pencarian.
   - Hasil akan tersaring langsung tanpa reload halaman.
2. **Kupon Diskon Belanja:**
   - Masukkan makanan ke keranjang, buka `keranjang.html`.
   - Masukkan kode promo: **`SAJICEPATHEMAT`** dan klik *Terapkan*. Diskon 20% otomatis terpotong!
3. **Alur Checkout & Kode Unik:**
   - Lakukan checkout di `checkout.html`, pilih metode pembayaran (COD / Virtual Account / QRIS).
   - Klik *Buat Pesanan Sekarang*. Sistem menghasilkan kode unik format `SJC-YYYYMMDD-XXX` dan mencatatnya ke riwayat.
4. **Pelacakan Status & Pembatalan:**
   - Buka `pesanan.html` untuk melihat stepper alur status: *Menunggu konfirmasi ➔ Dikonfirmasi ➔ Sedang disiapkan ➔ Siap dikirim ➔ Dalam pengantaran ➔ Selesai*.
   - Pesanan berstatus "Menunggu konfirmasi" dapat dibatalkan langsung oleh pelanggan.
5. **Pemrosesan di Portal Restoran:**
   - Beralih ke portal resto di `restoran/pesanan.html`. Restoran dapat mengonfirmasi pesanan dan memajukan tahapan persiapan makanan.
6. **Grafik & Ekspor CSV Admin:**
   - Buka `admin/dashboard.html` untuk melihat visualisasi grafik penjualan interaktif.
   - Buka `admin/laporan.html` dan klik *Unduh CSV* untuk mengunduh rekapitulasi data pesanan.
7. **Reset Data Demo:**
   - Jika ingin mengembalikan seluruh data ke kondisi awal, klik tombol *Reset Data Demo Asli* pada widget role switcher di pojok kanan bawah.

---

## 🎨 6. Palet Warna & Tipografi

- **Oranye Utama:** `#F97316`
- **Oranye Gelap:** `#EA580C`
- **Latar Belakang:** `#FFF7ED` & `#FFFFFF`
- **Teks Utama:** `#1F2937`
- **Teks Sekunder:** `#6B7280`
- **Status Berhasil:** `#10B981`
- **Font:** *Plus Jakarta Sans* (Google Fonts)
- **Ikon:** *Font Awesome 6*
