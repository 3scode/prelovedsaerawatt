import type { Product, ProductCategory } from "@/types/product";

function isoDaysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

interface DemoSeed {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  size: string;
  category: ProductCategory;
  description: string;
  defectNotes: string | null;
  image: string;
  status: boolean;
  daysAgo: number;
}

const seeds: DemoSeed[] = [
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c01",
    name: "Aurora Wool Coat",
    slug: "aurora-wool-coat",
    sku: "PSW-2610-001",
    price: 485000,
    size: "M",
    category: "Outerwear",
    description:
      "Coat wol burgundy dengan potongan straight dan kerah tinggi. Bahan tebal, hangat, dan jatuhnya rapi. Dibeli di Tokyo, dipakai tiga kali untuk acara malam. Bukan barang baru, tapi masih sangat layak jadi outer andalan.",
    defectNotes:
      "Ada bekas jahitan kecil di bagian dalam lining kiri (tidak terlihat saat dipakai). Tombol kanan bawah sedikit longgar, sudah kami kencangkan. Tidak ada noda atau lubang.",
    image: "/images/products/product-01.jpg",
    status: true,
    daysAgo: 2,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c02",
    name: "Ivory Lace Blouse",
    slug: "ivory-lace-blouse",
    sku: "PSW-2610-002",
    price: 165000,
    size: "S",
    category: "Atasan",
    description:
      "Blouse ivory dengan detail lace di bagian kerah dan lengan. Ringan, adem, cocok untuk layer atau dipakai langsung. Kondisi terawat dan sudah dicuci bersih sebelum difoto.",
    defectNotes:
      "Serat lace di pergelangan kanan sedikit melebar sekitar 1 cm. Tidak ada noda permanen.",
    image: "/images/products/product-02.jpg",
    status: true,
    daysAgo: 4,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c03",
    name: "Classic White Shirt",
    slug: "classic-white-shirt",
    sku: "PSW-2610-003",
    price: 145000,
    size: "M",
    category: "Atasan",
    description:
      "Kemeja putih oversize dengan bahan katun poplin. Potongan bersih, mudah dipadukan dengan denim atau rok. Sudah disetrika dan siap dipakai.",
    defectNotes: "Bagian ujung manset kanan ada bekas lipatan halus. Kancing lengkap.",
    image: "/images/products/product-03.jpg",
    status: false,
    daysAgo: 8,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c04",
    name: "Camel Wool Coat",
    slug: "camel-wool-coat",
    sku: "PSW-2610-004",
    price: 525000,
    size: "L",
    category: "Outerwear",
    description:
      "Coat camel dengan siluet relaxed dan saku dalam. Bahan wool blend yang tidak gatal. Warna netral yang mudah dipakai dari kantor sampai akhir pekan.",
    defectNotes:
      "Ada sedikit pilling di bagian bawah lengan kiri. Lining utuh, tidak ada robekan.",
    image: "/images/products/product-04.jpg",
    status: true,
    daysAgo: 6,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c05",
    name: "Cielo Blue Trench",
    slug: "cielo-blue-trench",
    sku: "PSW-2610-005",
    price: 460000,
    size: "M",
    category: "Outerwear",
    description:
      "Trench coat biru langit dengan belt dan tali pinggang. Statement piece yang ringan tapi tetap menjaga bentuk. Cocok untuk cuaca hujan ringan.",
    defectNotes:
      "Belt asli tidak disertakan, diganti tali kain senada. Ada bekas air samar di bagian hem belakang.",
    image: "/images/products/product-06.jpg",
    status: true,
    daysAgo: 3,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c06",
    name: "Cream Cable Knit",
    slug: "cream-cable-knit",
    sku: "PSW-2610-006",
    price: 185000,
    size: "M",
    category: "Atasan",
    description:
      "Sweater rajut cream dengan tekstur cable yang tebal. Bahan lembut, tidak membuat gerah, dan sudah dirajut ulang di bagian ketiak. Potongan relaxed.",
    defectNotes:
      "Bagian ketiak kanan pernah diperbaiki dengan benang senada. Hasil rapi dan tidak terlihat dari luar.",
    image: "/images/products/product-07.jpg",
    status: true,
    daysAgo: 11,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c07",
    name: "Rust Bomber Jacket",
    slug: "rust-bomber-jacket",
    sku: "PSW-2610-007",
    price: 275000,
    size: "S",
    category: "Outerwear",
    description:
      "Bomber jacket warna rust dengan bahan parasut ringan. Elastic di pinggang masih kencang, zip lancar. Cocok untuk gaya kasual sehari-hari.",
    defectNotes:
      "Ada goresan tipis di bagian lengan kanan dekat siku. Zip utama berfungsi normal.",
    image: "/images/products/product-08.jpg",
    status: false,
    daysAgo: 14,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c08",
    name: "Rose Relaxed Trousers",
    slug: "rose-relaxed-trousers",
    sku: "PSW-2610-008",
    price: 175000,
    size: "M",
    category: "Bawahan",
    description:
      "Celana relaxed fit warna dusty rose dengan saku besar dan elastic waist. Nyaman untuk perjalanan atau kerja seharian. Bahan sedikit stretch.",
    defectNotes:
      "Warna sedikit lebih pudar di bagian lutut. Tidak ada lubang atau jahitan lepas.",
    image: "/images/products/product-09.jpg",
    status: true,
    daysAgo: 5,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c09",
    name: "Monochrome Stripe Set",
    slug: "monochrome-stripe-set",
    sku: "PSW-2610-009",
    price: 225000,
    size: "S",
    category: "Atasan",
    description:
      "Setelan kemeja stripe hitam-putih dan rok A-line hitam. Dijual sebagai satu set, bisa dipakai terpisah. Potongan kemeja pas di badan, rok dengan pinggang karet.",
    defectNotes:
      "Kemeja memiliki satu kancing cadangan yang sudah diganti. Rok tidak memiliki defect.",
    image: "/images/products/product-10.jpg",
    status: true,
    daysAgo: 1,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c10",
    name: "Azure Floral Heels",
    slug: "azure-floral-heels",
    sku: "PSW-2610-010",
    price: 195000,
    size: "38",
    category: "Aksesori",
    description:
      "Pump heels biru dengan motif floral. Tinggi hak 9 cm, nyaman untuk acara. Bagian dalam sudah dibersihkan dan diberi sole baru.",
    defectNotes:
      "Ada bekas pemakaian ringan di sol bagian depan. Motif tidak pudar.",
    image: "/images/products/product-12.jpg",
    status: true,
    daysAgo: 9,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c11",
    name: "Denim Button Dress",
    slug: "denim-button-dress",
    sku: "PSW-2610-011",
    price: 210000,
    size: "M",
    category: "Dress",
    description:
      "Dress denim dengan kancing depan dan potongan flowy di bawah pinggang. Bahan denim lembut, tidak kaku. Bisa dipakai dengan sabuk atau tanpa.",
    defectNotes:
      "Kancing kedua dari atas sedikit longgar. Tidak ada noda atau bagian yang tipis.",
    image: "/images/products/product-13.jpg",
    status: true,
    daysAgo: 2,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c12",
    name: "Noir Moto Jacket",
    slug: "noir-moto-jacket",
    sku: "PSW-2610-012",
    price: 395000,
    size: "S",
    category: "Outerwear",
    description:
      "Moto jacket kulit sintetis hitam dengan detail zip dan snap button. Potongan fitted, lining utuh, dan sudah dikondisikan ulang. Statement piece yang tidak lekang waktu.",
    defectNotes:
      "Ada kerutan alami di bagian lipatan lengan. Satu zip saku dalam sedikit keras, masih berfungsi.",
    image: "/images/products/product-14.jpg",
    status: true,
    daysAgo: 7,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c13",
    name: "Scarlet Silk Gown",
    slug: "scarlet-silk-gown",
    sku: "PSW-2610-013",
    price: 550000,
    size: "S",
    category: "Dress",
    description:
      "Gaun merah dengan bahan satin silk blend dan siluet A-line. Ringan, jatuhnya mengalir, dan pernah dipakai sekali untuk acara formal. Dry clean sebelum disimpan.",
    defectNotes:
      "Ada tarikan benang halus di bagian belakang, tidak sampai robek. Tidak ada noda.",
    image: "/images/products/product-15.jpg",
    status: false,
    daysAgo: 16,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c14",
    name: "Coral Top-Handle Bag",
    slug: "coral-top-handle-bag",
    sku: "PSW-2610-014",
    price: 320000,
    size: "All size",
    category: "Aksesori",
    description:
      "Handbag coral dengan handle atas dan strap panjang yang bisa dilepas. Ruang cukup untuk ponsel, dompet, dan kunci. Hardware masih mengkilap.",
    defectNotes:
      "Ada micro-scratch di bagian bawah tas. Tidak terlihat saat dipakai.",
    image: "/images/products/product-16.jpg",
    status: true,
    daysAgo: 10,
  },
  {
    id: "a0b1c2d3-e4f5-4a6b-8c7d-1e2f3a4b5c15",
    name: "Poppy Floral Dress",
    slug: "poppy-floral-dress",
    sku: "PSW-2610-015",
    price: 235000,
    size: "M",
    category: "Dress",
    description:
      "Dress merah dengan motif floral kecil dan ikat pinggang anyaman. Potongan V-neck, bahan ringan, cocok untuk siang atau malam. Sudah dicuci dan disetrika.",
    defectNotes:
      "Ikat pinggang bukan original (pengganti senada). Ada jahitan kecil di bagian dalam kerah.",
    image: "/images/products/product-17.jpg",
    status: true,
    daysAgo: 13,
  },
];

export const DEMO_PRODUCTS: Product[] = seeds
  .map((seed): Product => {
    const createdAt = isoDaysAgo(seed.daysAgo);
    return {
      id: seed.id,
      createdAt,
      updatedAt: createdAt,
      name: seed.name,
      slug: seed.slug,
      sku: seed.sku,
      price: seed.price,
      size: seed.size,
      category: seed.category,
      description: seed.description,
      defectNotes: seed.defectNotes,
      images: [seed.image],
      status: seed.status,
      createdBy: null,
      requestId: null,
    };
  })
  .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

export const DEMO_PRODUCT_COUNT = DEMO_PRODUCTS.length;
