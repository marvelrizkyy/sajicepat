/**
 * SAJICEPAT - DATA DEMO & LOCALSTORAGE SEED
 * Proyek Pemesanan Makanan Online Kelas XII RPL
 * Pure Frontend & LocalStorage Architecture
 */

// Initial Seed Data for SajiCepat
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Semua", slug: "semua", icon: "fa-utensils", count: 16 },
  { id: 2, name: "Makanan berat", slug: "makanan-berat", icon: "fa-bowl-rice", count: 6 },
  { id: 3, name: "Makanan ringan", slug: "makanan-ringan", icon: "fa-cookie-bite", count: 3 },
  { id: 4, name: "Minuman", slug: "minuman", icon: "fa-glass-water", count: 3 },
  { id: 5, name: "Dessert", slug: "dessert", icon: "fa-ice-cream", count: 2 },
  { id: 6, name: "Fast food", slug: "fast-food", icon: "fa-burger", count: 2 }
];

const DEFAULT_RESTAURANTS = [
  {
    id: 1,
    name: "Ayam Geprek Juara Nusantara",
    slug: "ayam-geprek-juara",
    category: "Fast food",
    rating: 4.8,
    reviewsCount: 340,
    address: "Jl. Tebet Raya No. 18, Jakarta Selatan",
    phone: "0812-9988-7711",
    operationalHours: "10:00 - 22:00",
    deliveryFee: 8000,
    minOrder: 15000,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=150&auto=format&fit=crop&q=80",
    description: "Spesialis ayam geprek renyah dengan cabai rawit segar petik dadakan dan aneka sambal khas Nusantara."
  },
  {
    id: 2,
    name: "Rumah Makan Padang Minang Asli",
    slug: "padang-minang-asli",
    category: "Makanan berat",
    rating: 4.9,
    reviewsCount: 520,
    address: "Jl. Fatmawati Raya No. 42, Jakarta Selatan",
    phone: "0813-1122-3344",
    operationalHours: "08:00 - 21:00",
    deliveryFee: 10000,
    minOrder: 20000,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80",
    description: "Cita rasa otentik Minangkabau dengan resep turun-temurun rendang daging sapi empuk legendaris."
  },
  {
    id: 3,
    name: "Dapur Bakso & Mie Sejati",
    slug: "bakso-mie-sejati",
    category: "Makanan berat",
    rating: 4.7,
    reviewsCount: 290,
    address: "Jl. KH Ahmad Dahlan No. 15, Jakarta Selatan",
    phone: "0857-4433-2211",
    operationalHours: "09:00 - 21:30",
    deliveryFee: 7000,
    minOrder: 15000,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=150&auto=format&fit=crop&q=80",
    description: "Bakso daging sapi asli tanpa pengawet dengan kuah kaldu sapi sumsum kental gurih memanjakan lidah."
  },
  {
    id: 4,
    name: "Kedai Kopi & Roti Kenangan",
    slug: "kopi-roti-kenangan",
    category: "Minuman",
    rating: 4.8,
    reviewsCount: 410,
    address: "Jl. Senopati No. 88, Jakarta Selatan",
    phone: "0878-5566-7788",
    operationalHours: "07:30 - 23:00",
    deliveryFee: 6000,
    minOrder: 12000,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80",
    description: "Kopi artisan nusantara, roti bakar empuk aromatik, dan aneka snack modern teman produktif harianmu."
  },
  {
    id: 5,
    name: "Sweet Treats Bakery & Gelato",
    slug: "sweet-treats-bakery",
    category: "Dessert",
    rating: 4.9,
    reviewsCount: 180,
    address: "Jl. Radio Dalam Raya No. 9, Jakarta Selatan",
    phone: "0819-2233-4455",
    operationalHours: "10:00 - 21:00",
    deliveryFee: 9000,
    minOrder: 25000,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80",
    description: "Kue pastry panggang premium setiap pagi dan gelato homemade lembut kaya sensasi rasa istimewa."
  }
];

const DEFAULT_MENUS = [
  {
    id: 1,
    name: "Ayam Geprek Mozarella Pedas Level 3",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    category: "Fast food",
    price: 25000,
    originalPrice: 28000,
    rating: 4.9,
    soldCount: 420,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    description: "Dada ayam fillet crispy digeprek dengan sambal bawang merah pedas segar, diselimuti lelehan keju mozzarella gurih melimpah.",
    isAvailable: true,
    stock: 45,
    isPopular: true
  },
  {
    id: 2,
    name: "Paket Nasi Padang Rendang Daging Komplit",
    restoId: 2,
    restoName: "Rumah Makan Padang Minang Asli",
    category: "Makanan berat",
    price: 32000,
    originalPrice: 35000,
    rating: 4.9,
    soldCount: 560,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    description: "Nasi pulen hangat dengan rendang sapi empuk berempah khas Minang, daun singkong muda, sayur nangka gurih, dan sambal ijo.",
    isAvailable: true,
    stock: 30,
    isPopular: true
  },
  {
    id: 3,
    name: "Bakso Urat Granat Kuah Sumsum",
    restoId: 3,
    restoName: "Dapur Bakso & Mie Sejati",
    category: "Makanan berat",
    price: 26000,
    originalPrice: 30000,
    rating: 4.8,
    soldCount: 380,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    description: "Satu bakso urat jumbo kenyal berdaging isi tetelan gurih, 3 bakso halus, tahu bakso, mie kuning, bihun, dan kuah kaldu sapi sumsum.",
    isAvailable: true,
    stock: 25,
    isPopular: true
  },
  {
    id: 4,
    name: "Mie Goreng Jawa Spesial Telur Ceplok",
    restoId: 3,
    restoName: "Dapur Bakso & Mie Sejati",
    category: "Makanan berat",
    price: 22000,
    originalPrice: 24000,
    rating: 4.7,
    soldCount: 290,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
    description: "Mie telur kenyal ditumis dengan suwiran ayam, bakso, sayuran kol dan sawi segar dengan kecap manis karamelisasi khas Jawa.",
    isAvailable: true,
    stock: 40,
    isPopular: false
  },
  {
    id: 5,
    name: "Nasi Goreng Seafood Spesial SajiCepat",
    restoId: 2,
    restoName: "Rumah Makan Padang Minang Asli",
    category: "Makanan berat",
    price: 28000,
    originalPrice: 32000,
    rating: 4.8,
    soldCount: 310,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
    description: "Nasi goreng aroma smokey wajan panas dipadu udang segar, cumi kenyal, bakso ikan, telur orak-arik, dan kerupuk udang renyah.",
    isAvailable: true,
    stock: 35,
    isPopular: true
  },
  {
    id: 6,
    name: "Paket Ayam Geprek Sambal Matah Bali",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    category: "Fast food",
    price: 24000,
    originalPrice: 26000,
    rating: 4.7,
    soldCount: 240,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    description: "Ayam crispy renyah dibalur rajangan sambal matah harum serai, daun jeruk, bawang merah, dan cabai rawit minyak kelapa murni.",
    isAvailable: true,
    stock: 50,
    isPopular: false
  },
  {
    id: 7,
    name: "Dimsum Siomay Mentai Panggang (4 pcs)",
    restoId: 4,
    restoName: "Kedai Kopi & Roti Kenangan",
    category: "Makanan ringan",
    price: 20000,
    originalPrice: 23000,
    rating: 4.8,
    soldCount: 195,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80",
    description: "Siomay ayam udang padat kenyal dengan saus mentai gurih creamy yang ditorch hingga harum menggoda selera.",
    isAvailable: true,
    stock: 20,
    isPopular: true
  },
  {
    id: 8,
    name: "Kentang Goreng Truffle Crispy Seasoned",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    category: "Makanan ringan",
    price: 18000,
    originalPrice: 20000,
    rating: 4.6,
    soldCount: 170,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
    description: "French fries impor garing berlumur aroma minyak truffle premium, taburan daun peterseli dan keju parmesan gurih.",
    isAvailable: true,
    stock: 30,
    isPopular: false
  },
  {
    id: 9,
    name: "Roti Panggang Cokelat Keju Susu Lumer",
    restoId: 4,
    restoName: "Kedai Kopi & Roti Kenangan",
    category: "Makanan ringan",
    price: 17000,
    originalPrice: 19000,
    rating: 4.7,
    soldCount: 220,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    description: "Roti brioche bakar mentega isi dark chocolate leleh berlimpah, parutan cheddar gurih dan siraman susu kental manis.",
    isAvailable: true,
    stock: 25,
    isPopular: false
  },
  {
    id: 10,
    name: "Es Kopi Susu Gula Aren Barista Blend",
    restoId: 4,
    restoName: "Kedai Kopi & Roti Kenangan",
    category: "Minuman",
    price: 18000,
    originalPrice: 20000,
    rating: 4.9,
    soldCount: 650,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    description: "Espresso double shot biji kopi arabika robusta pilihan, susu segar creamy dan sirup gula aren organik asli Lebak.",
    isAvailable: true,
    stock: 100,
    isPopular: true
  },
  {
    id: 11,
    name: "Matcha Latte Creamy Japanese Style",
    restoId: 4,
    restoName: "Kedai Kopi & Roti Kenangan",
    category: "Minuman",
    price: 21000,
    originalPrice: 23000,
    rating: 4.8,
    soldCount: 310,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
    description: "Bubuk teh hijau matcha asli Uji Kyoto dipadukan dengan fresh milk lembut, menghadirkan aroma otentik menenangkan.",
    isAvailable: true,
    stock: 40,
    isPopular: false
  },
  {
    id: 12,
    name: "Es Teh Melati Manis Segar Jumbo (1 Liter)",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    category: "Minuman",
    price: 8000,
    originalPrice: 10000,
    rating: 4.9,
    soldCount: 780,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    description: "Seduhan daun teh wangi melati pilihan dengan es batu kristal bersih dan rasa manis pas penghilang dahaga.",
    isAvailable: true,
    stock: 120,
    isPopular: true
  },
  {
    id: 13,
    name: "Choco Lava Molten Cake with Vanilla Ice Cream",
    restoId: 5,
    restoName: "Sweet Treats Bakery & Gelato",
    category: "Dessert",
    price: 28000,
    originalPrice: 32000,
    rating: 4.9,
    soldCount: 230,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    description: "Cake cokelat Belgia hangat dengan lelehan cokelat cair di bagian dalam, disajikan bersama satu scoop es krim vanila lembut.",
    isAvailable: true,
    stock: 20,
    isPopular: true
  },
  {
    id: 14,
    name: "Croissant French Butter Flaky Almond",
    restoId: 5,
    restoName: "Sweet Treats Bakery & Gelato",
    category: "Dessert",
    price: 24000,
    originalPrice: 27000,
    rating: 4.8,
    soldCount: 180,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    description: "Croissant mentega Prancis berlapis renyah dengan isian krim almond manis lembut dan taburan kacang almond sangrai gurih.",
    isAvailable: true,
    stock: 18,
    isPopular: false
  },
  {
    id: 15,
    name: "Soto Ayam Lamongan Koya Gurih",
    restoId: 3,
    restoName: "Dapur Bakso & Mie Sejati",
    category: "Makanan berat",
    price: 23000,
    originalPrice: 25000,
    rating: 4.8,
    soldCount: 275,
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600&auto=format&fit=crop&q=80",
    description: "Kuah kuning kunyit kaya rempah dengan suwiran ayam kampung, telur rebus, bihun, kubis, seledri dan bubuk koya gurih melimpah.",
    isAvailable: true,
    stock: 25,
    isPopular: false
  },
  {
    id: 16,
    name: "Double Cheese Beef Burger with Crispy Onion",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    category: "Fast food",
    price: 32000,
    originalPrice: 36000,
    rating: 4.7,
    soldCount: 310,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    description: "Patty daging sapi Australia tebal juicy diapit roti wijen lembut, double melted cheddar, selada renyah, dan saus tartar rahasia.",
    isAvailable: false,
    stock: 0,
    isPopular: false
  }
];

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Administrator SajiCepat",
    email: "admin@sajicepat.com",
    password: "admin",
    role: "admin",
    phone: "0811-0000-9999",
    address: "Kantor Pusat SajiCepat Tech, Tower 8 Lt. 12, Jakarta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10"
  },
  {
    id: 2,
    name: "Ayam Geprek Juara",
    email: "resto@sajicepat.com",
    password: "password123",
    role: "restoran",
    restoId: 1,
    phone: "0812-9988-7711",
    address: "Jl. Tebet Raya No. 18, Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-02-01"
  },
  {
    id: 3,
    name: "RM Padang Minang Asli",
    email: "padang@sajicepat.com",
    password: "password123",
    role: "restoran",
    restoId: 2,
    phone: "0813-1122-3344",
    address: "Jl. Fatmawati Raya No. 42, Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-02-15"
  },
  {
    id: 9,
    name: "Dapur Bakso & Mie Sejati",
    email: "bakso@sajicepat.com",
    password: "password123",
    role: "restoran",
    restoId: 3,
    phone: "0857-4433-2211",
    address: "Jl. KH Ahmad Dahlan No. 15, Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-02-20"
  },
  {
    id: 10,
    name: "Kedai Kopi & Roti Kenangan",
    email: "kopi@sajicepat.com",
    password: "password123",
    role: "restoran",
    restoId: 4,
    phone: "0878-5566-7788",
    address: "Jl. Senopati No. 88, Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-02-25"
  },
  {
    id: 11,
    name: "Sweet Treats Bakery & Gelato",
    email: "bakery@sajicepat.com",
    password: "password123",
    role: "restoran",
    restoId: 5,
    phone: "0819-2233-4455",
    address: "Jl. Radio Dalam Raya No. 9, Jakarta Selatan",
    avatar: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-03-01"
  },
  {
    id: 4,
    name: "Budi Santoso",
    email: "budi@gmail.com",
    password: "password123",
    role: "pelanggan",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 45, RT 02/RW 04, Menteng, Jakarta Pusat",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-03-01"
  },
  {
    id: 5,
    name: "Siti Rahmawati",
    email: "siti@gmail.com",
    password: "password123",
    role: "pelanggan",
    phone: "0812-9876-5432",
    address: "Jl. Anggrek No. 12, Sukajadi, Bandung",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-03-12"
  },
  {
    id: 6,
    name: "Ahmad Fauzi",
    email: "ahmad@gmail.com",
    password: "password123",
    role: "pelanggan",
    phone: "0856-1234-5678",
    address: "Komplek Melati Indah B3/10, Rungkut, Surabaya",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-04-05"
  },
  {
    id: 7,
    name: "Dewi Lestari",
    email: "dewi@gmail.com",
    password: "password123",
    role: "pelanggan",
    phone: "0877-8899-0011",
    address: "Jl. Cendrawasih No. 8, Depok, Sleman, Yogyakarta",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-04-18"
  },
  {
    id: 8,
    name: "Rizky Pratama",
    email: "rizky@gmail.com",
    password: "password123",
    role: "pelanggan",
    phone: "0813-4455-6677",
    address: "Perumahan Griya Asri Blok D5, Tembalang, Semarang",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    createdAt: "2026-05-02"
  }
];

const DEFAULT_ORDERS = [
  {
    id: "SJC-20261019-001",
    customerName: "Budi Santoso",
    customerEmail: "budi@gmail.com",
    customerPhone: "0812-3456-7890",
    deliveryAddress: "Jl. Merdeka No. 45, RT 02/RW 04, Menteng, Jakarta Pusat",
    orderNotes: "Jangan terlalu pedas, tolong minta sendok garpu plastik.",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    items: [
      { id: 1, name: "Ayam Geprek Mozarella Pedas Level 3", price: 25000, quantity: 2, subtotal: 50000 },
      { id: 12, name: "Es Teh Melati Manis Segar Jumbo (1 Liter)", price: 8000, quantity: 1, subtotal: 8000 }
    ],
    subtotal: 58000,
    deliveryFee: 8000,
    discount: 5000,
    total: 61000,
    paymentMethod: "Tunai saat pengantaran (COD)",
    paymentStatus: "Lunas",
    status: "Selesai",
    createdAt: "2026-10-19 12:30",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-19 12:30" },
      { status: "Dikonfirmasi", time: "2026-10-19 12:35" },
      { status: "Sedang disiapkan", time: "2026-10-19 12:40" },
      { status: "Siap dikirim", time: "2026-10-19 13:00" },
      { status: "Dalam pengantaran", time: "2026-10-19 13:05" },
      { status: "Selesai", time: "2026-10-19 13:30" }
    ]
  },
  {
    id: "SJC-20261019-002",
    customerName: "Siti Rahmawati",
    customerEmail: "siti@gmail.com",
    customerPhone: "0812-9876-5432",
    deliveryAddress: "Jl. Anggrek No. 12, Sukajadi, Bandung",
    orderNotes: "Kuah gulai dipisah ya pak.",
    restoId: 2,
    restoName: "Rumah Makan Padang Minang Asli",
    items: [
      { id: 2, name: "Paket Nasi Padang Rendang Daging Komplit", price: 32000, quantity: 2, subtotal: 64000 },
      { id: 5, name: "Nasi Goreng Seafood Spesial SajiCepat", price: 28000, quantity: 1, subtotal: 28000 }
    ],
    subtotal: 92000,
    deliveryFee: 10000,
    discount: 0,
    total: 102000,
    paymentMethod: "Dompet digital (GoPay)",
    paymentStatus: "Lunas (Simulasi)",
    status: "Dalam pengantaran",
    createdAt: "2026-10-19 13:15",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-19 13:15" },
      { status: "Dikonfirmasi", time: "2026-10-19 13:18" },
      { status: "Sedang disiapkan", time: "2026-10-19 13:22" },
      { status: "Siap dikirim", time: "2026-10-19 13:45" },
      { status: "Dalam pengantaran", time: "2026-10-19 13:50" }
    ]
  },
  {
    id: "SJC-20261020-003",
    customerName: "Budi Santoso",
    customerEmail: "budi@gmail.com",
    customerPhone: "0812-3456-7890",
    deliveryAddress: "Jl. Merdeka No. 45, RT 02/RW 04, Menteng, Jakarta Pusat",
    orderNotes: "Banyakin sambal dan bawang gorengnya.",
    restoId: 3,
    restoName: "Dapur Bakso & Mie Sejati",
    items: [
      { id: 3, name: "Bakso Urat Granat Kuah Sumsum", price: 26000, quantity: 1, subtotal: 26000 },
      { id: 10, name: "Es Kopi Susu Gula Aren Barista Blend", price: 18000, quantity: 1, subtotal: 18000 }
    ],
    subtotal: 44000,
    deliveryFee: 7000,
    discount: 0,
    total: 51000,
    paymentMethod: "Transfer bank (BCA)",
    paymentStatus: "Lunas (Simulasi)",
    status: "Sedang disiapkan",
    createdAt: "2026-10-20 08:45",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-20 08:45" },
      { status: "Dikonfirmasi", time: "2026-10-20 08:48" },
      { status: "Sedang disiapkan", time: "2026-10-20 08:52" }
    ]
  },
  {
    id: "SJC-20261020-004",
    customerName: "Ahmad Fauzi",
    customerEmail: "ahmad@gmail.com",
    customerPhone: "0856-1234-5678",
    deliveryAddress: "Komplek Melati Indah B3/10, Rungkut, Surabaya",
    orderNotes: "Tolong diantar sebelum jam 10 pagi.",
    restoId: 1,
    restoName: "Ayam Geprek Juara Nusantara",
    items: [
      { id: 1, name: "Ayam Geprek Mozarella Pedas Level 3", price: 25000, quantity: 1, subtotal: 25000 }
    ],
    subtotal: 25000,
    deliveryFee: 8000,
    discount: 0,
    total: 33000,
    paymentMethod: "Dompet digital (OVO)",
    paymentStatus: "Lunas (Simulasi)",
    status: "Dikonfirmasi",
    createdAt: "2026-10-20 09:05",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-20 09:05" },
      { status: "Dikonfirmasi", time: "2026-10-20 09:08" }
    ]
  },
  {
    id: "SJC-20261020-005",
    customerName: "Dewi Lestari",
    customerEmail: "dewi@gmail.com",
    customerPhone: "0877-8899-0011",
    deliveryAddress: "Jl. Cendrawasih No. 8, Depok, Sleman, Yogyakarta",
    orderNotes: "Kue untuk surprise ultah, sertakan lilin kecil jika ada.",
    restoId: 5,
    restoName: "Sweet Treats Bakery & Gelato",
    items: [
      { id: 13, name: "Choco Lava Molten Cake with Vanilla Ice Cream", price: 28000, quantity: 1, subtotal: 28000 },
      { id: 14, name: "Croissant French Butter Flaky Almond", price: 24000, quantity: 2, subtotal: 48000 }
    ],
    subtotal: 76000,
    deliveryFee: 9000,
    discount: 5000,
    total: 80000,
    paymentMethod: "Transfer bank (Mandiri)",
    paymentStatus: "Menunggu Verifikasi (Simulasi)",
    status: "Menunggu konfirmasi",
    createdAt: "2026-10-20 09:20",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-20 09:20" }
    ]
  },
  {
    id: "SJC-20261018-006",
    customerName: "Rizky Pratama",
    customerEmail: "rizky@gmail.com",
    customerPhone: "0813-4455-6677",
    deliveryAddress: "Perumahan Griya Asri Blok D5, Tembalang, Semarang",
    orderNotes: "",
    restoId: 4,
    restoName: "Kedai Kopi & Roti Kenangan",
    items: [
      { id: 10, name: "Es Kopi Susu Gula Aren Barista Blend", price: 18000, quantity: 2, subtotal: 36000 }
    ],
    subtotal: 36000,
    deliveryFee: 6000,
    discount: 0,
    total: 42000,
    paymentMethod: "Tunai saat pengantaran (COD)",
    paymentStatus: "Dibatalkan",
    status: "Dibatalkan",
    createdAt: "2026-10-18 19:10",
    history: [
      { status: "Menunggu konfirmasi", time: "2026-10-18 19:10" },
      { status: "Dibatalkan", time: "2026-10-18 19:15" }
    ]
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Budi Santoso",
    rating: 5,
    date: "19 Oktober 2026",
    comment: "Ayam geprek mozarella-nya gila enak banget! Keju molor melimpah, pedasnya nagih. Pengantaran juga cepat banget sampai sebelum 25 menit.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    item: "Ayam Geprek Mozarella Pedas Level 3",
    restoName: "Ayam Geprek Juara Nusantara",
    restoId: 1,
    helpfulCount: 38
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    rating: 5,
    date: "18 Oktober 2026",
    comment: "Rendang Padang Minang Asli beneran juara, bumbunya hitam meresap dan dagingnya lumer di mulut. Porsinya pas mengenyangkan, kemasannya juga rapi dan higienis.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    item: "Paket Nasi Padang Rendang Daging Komplit",
    restoName: "Rumah Makan Padang Minang Asli",
    restoId: 2,
    helpfulCount: 29
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    rating: 5,
    date: "17 Oktober 2026",
    comment: "Aplikasi SajiCepat sangat membantu dan tampilannya bersih, modern, gak ribet. Mau pesan kopi atau makan siang tinggal klik langsung beres!",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    item: "Es Kopi Susu Gula Aren Barista Blend",
    restoName: "Kedai Kopi & Roti Kenangan",
    restoId: 4,
    helpfulCount: 21
  },
  {
    id: 4,
    name: "Dewi Lestari",
    rating: 5,
    date: "16 Oktober 2026",
    comment: "Choco lava cake-nya masih hangat pas sampai, lelehan cokelatnya lumer dipadu es krim vanila lembut dingin. Dessert terbaik buat mood booster sore hari!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    item: "Choco Lava Molten Cake with Vanilla Ice Cream",
    restoName: "Sweet Treats Bakery & Gelato",
    restoId: 5,
    helpfulCount: 17
  },
  {
    id: 5,
    name: "Rizky Pratama",
    rating: 4,
    date: "15 Oktober 2026",
    comment: "Bakso urat granatnya mantap berasa daging sapinya! Kuah kaldunya gurih kental. Sedikit saran sambalnya bisa ditambah lagi biar makin pedas nampol.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    item: "Bakso Urat Granat Kuah Sumsum",
    restoName: "Dapur Bakso & Mie Sejati",
    restoId: 3,
    helpfulCount: 14
  },
  {
    id: 6,
    name: "Nadia Safitri",
    rating: 5,
    date: "14 Oktober 2026",
    comment: "Croissant almond-nya sangat renyah dan buttery banget aromanya! Packaging rapi gak penyok sama sekali waktu diantar abang kurir. Pasti langganan terus.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    item: "Croissant French Butter Flaky Almond",
    restoName: "Sweet Treats Bakery & Gelato",
    restoId: 5,
    helpfulCount: 12
  },
  {
    id: 7,
    name: "Hendra Gunawan",
    rating: 5,
    date: "13 Oktober 2026",
    comment: "Ayam geprek cabe rawitnya nendang abis, kulitnya tetap crispy kriuk walau diantar 20 menit. Porsi nasinya juga pulen banyak!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    item: "Ayam Geprek Mozarella Pedas Level 3",
    restoName: "Ayam Geprek Juara Nusantara",
    restoId: 1,
    helpfulCount: 19
  },
  {
    id: 8,
    name: "Maya Indah",
    rating: 5,
    date: "12 Oktober 2026",
    comment: "Gulai tunjang dan rendangnya otentik khas Minang tulen! Kuahnya gurih pekat kaya rempah. Restoran Padang terenak di SajiCepat.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    item: "Paket Nasi Padang Rendang Daging Komplit",
    restoName: "Rumah Makan Padang Minang Asli",
    restoId: 2,
    helpfulCount: 16
  },
  {
    id: 9,
    name: "Fajar Nugroho",
    rating: 5,
    date: "11 Oktober 2026",
    comment: "Soto ayam lamongan koya dan bakso uratnya juara! Kuah sumsumnya gurih kaldu sapi asli, bukan micin. Sangat recommended buat makan siang.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    item: "Soto Ayam Lamongan Koya Gurih",
    restoName: "Dapur Bakso & Mie Sejati",
    restoId: 3,
    helpfulCount: 11
  },
  {
    id: 10,
    name: "Kevin Alexander",
    rating: 5,
    date: "10 Oktober 2026",
    comment: "Roti brioche bakar cokelat keju dan es kopi arennya kombinasi sarapan paling mantap! Packaging rapi dan gelas kopi tersegel rapat.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    item: "Roti Brioche Bakar Dark Chocolate Keju",
    restoName: "Kedai Kopi & Roti Kenangan",
    restoId: 4,
    helpfulCount: 15
  }
];

/**
 * Initialize LocalStorage with default data if empty
 */
function initDatabase() {
  if (!localStorage.getItem('sajicepat_categories')) {
    localStorage.setItem('sajicepat_categories', JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem('sajicepat_restaurants')) {
    localStorage.setItem('sajicepat_restaurants', JSON.stringify(DEFAULT_RESTAURANTS));
  }
  if (!localStorage.getItem('sajicepat_menus')) {
    localStorage.setItem('sajicepat_menus', JSON.stringify(DEFAULT_MENUS));
  }
  if (!localStorage.getItem('sajicepat_users')) {
    localStorage.setItem('sajicepat_users', JSON.stringify(DEFAULT_USERS));
  } else {
    // Synchronize to ensure all restaurants have active login accounts in existing LocalStorage
    try {
      let currentUsers = JSON.parse(localStorage.getItem('sajicepat_users')) || [];
      let updated = false;

      DEFAULT_USERS.forEach(defaultUser => {
        const exists = currentUsers.find(u => u.email.toLowerCase() === defaultUser.email.toLowerCase());
        if (!exists) {
          currentUsers.push(defaultUser);
          updated = true;
        }
      });

      // Synchronize all restaurants in sajicepat_restaurants to guarantee each has an active login account
      const restos = JSON.parse(localStorage.getItem('sajicepat_restaurants')) || DEFAULT_RESTAURANTS;
      restos.forEach(r => {
        const hasAccount = currentUsers.some(u => u.role === 'restoran' && (u.restoId === r.id || (r.slug && u.email.toLowerCase().includes(r.slug.replace(/-/g, '')))));
        if (!hasAccount) {
          const cleanSlug = (r.slug || 'resto' + r.id).replace(/[^a-z0-9]/g, '');
          currentUsers.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: r.name,
            email: `${cleanSlug}@sajicepat.com`,
            password: 'password123',
            role: 'restoran',
            restoId: r.id,
            phone: r.phone || '0812-0000-0000',
            address: r.address || 'Alamat Restoran',
            avatar: r.image || 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=120',
            createdAt: new Date().toISOString().slice(0, 10)
          });
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('sajicepat_users', JSON.stringify(currentUsers));
      }
    } catch (e) {
      console.error('Error synchronizing users:', e);
    }
  }

  if (!localStorage.getItem('sajicepat_orders')) {
    localStorage.setItem('sajicepat_orders', JSON.stringify(DEFAULT_ORDERS));
  }
  if (!localStorage.getItem('sajicepat_reviews')) {
    localStorage.setItem('sajicepat_reviews', JSON.stringify(DEFAULT_REVIEWS));
  } else {
    try {
      let currentReviews = JSON.parse(localStorage.getItem('sajicepat_reviews')) || [];
      let updatedRev = false;
      DEFAULT_REVIEWS.forEach(defRev => {
        if (!currentReviews.some(r => r.id === defRev.id)) {
          currentReviews.push(defRev);
          updatedRev = true;
        }
      });
      if (updatedRev) {
        localStorage.setItem('sajicepat_reviews', JSON.stringify(currentReviews));
      }
    } catch (e) {
      console.error('Error synchronizing reviews:', e);
    }
  }
  if (!localStorage.getItem('sajicepat_cart')) {
    localStorage.setItem('sajicepat_cart', JSON.stringify([]));
  }
  // Check if current user session is set, if not default to customer Budi Santoso for smooth instant demo
  if (!localStorage.getItem('sajicepat_current_user')) {
    localStorage.setItem('sajicepat_current_user', JSON.stringify(DEFAULT_USERS.find(u => u.email === 'budi@gmail.com') || DEFAULT_USERS[0]));
  }
}

// Data Access Helpers
function getCategories() {
  return JSON.parse(localStorage.getItem('sajicepat_categories')) || DEFAULT_CATEGORIES;
}

function saveCategories(categories) {
  localStorage.setItem('sajicepat_categories', JSON.stringify(categories));
}

function getRestaurants() {
  return JSON.parse(localStorage.getItem('sajicepat_restaurants')) || DEFAULT_RESTAURANTS;
}

function saveRestaurants(restaurants) {
  localStorage.setItem('sajicepat_restaurants', JSON.stringify(restaurants));
}

function getMenus() {
  return JSON.parse(localStorage.getItem('sajicepat_menus')) || DEFAULT_MENUS;
}

function saveMenus(menus) {
  localStorage.setItem('sajicepat_menus', JSON.stringify(menus));
}

function getUsers() {
  return JSON.parse(localStorage.getItem('sajicepat_users')) || DEFAULT_USERS;
}

function saveUsers(users) {
  localStorage.setItem('sajicepat_users', JSON.stringify(users));
}

function getOrders() {
  return JSON.parse(localStorage.getItem('sajicepat_orders')) || DEFAULT_ORDERS;
}

function saveOrders(orders) {
  localStorage.setItem('sajicepat_orders', JSON.stringify(orders));
}

function getReviews() {
  return JSON.parse(localStorage.getItem('sajicepat_reviews')) || DEFAULT_REVIEWS;
}

function saveReviews(reviews) {
  localStorage.setItem('sajicepat_reviews', JSON.stringify(reviews));
}

function getCart() {
  return JSON.parse(localStorage.getItem('sajicepat_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('sajicepat_cart', JSON.stringify(cart));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('sajicepat_current_user')) || null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('sajicepat_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('sajicepat_current_user');
  }
}

// Reset Database to Initial Demo Data
function resetDemoDatabase() {
  localStorage.setItem('sajicepat_categories', JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem('sajicepat_restaurants', JSON.stringify(DEFAULT_RESTAURANTS));
  localStorage.setItem('sajicepat_menus', JSON.stringify(DEFAULT_MENUS));
  localStorage.setItem('sajicepat_users', JSON.stringify(DEFAULT_USERS));
  localStorage.setItem('sajicepat_orders', JSON.stringify(DEFAULT_ORDERS));
  localStorage.setItem('sajicepat_reviews', JSON.stringify(DEFAULT_REVIEWS));
  localStorage.setItem('sajicepat_cart', JSON.stringify([]));
  localStorage.setItem('sajicepat_current_user', JSON.stringify(DEFAULT_USERS[3]));
  return true;
}

// Run init on script load
initDatabase();
