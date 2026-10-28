/**
 * Import katalog awal prelovedsaerawatt.
 *
 * - Upload foto dari folder `images/` ke Cloudinary (folder prelovedsaerawatt/products).
 * - Tulis entri produk ke `.data/products.json` (mode demo lokal).
 * - Idempoten: upload yang sudah tercatat di `.data/cloudinary-upload.json` dipakai ulang,
 *   dan produk dengan slug yang sama diganti, bukan diduplikasi.
 *
 * Jalankan: bun --env-file=.env.local scripts/import-catalog.ts
 */
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "images");
const DATA_DIR = path.join(ROOT, ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const UPLOAD_MANIFEST = path.join(DATA_DIR, "cloudinary-upload.json");
const SUMMARY_CSV = path.join(DATA_DIR, "import-summary.csv");

const BLOUSE = "Blouse pendek vest Bundling harga dari 35 sampe 55😍💃";
const CARDIGAN = "Cardigan rajutBundling harga 75 ribuan😍💃";
const DASTER = "Daster new &stelan piyama newBundling harga85 sampe 140 an😍💃";

type Kind = "blouse" | "cardigan" | "sweater" | "daster" | "piyama";

interface ImportItem {
  key: string;
  name: string;
  price: number;
  category: "Atasan" | "Outerwear" | "Dress";
  size: string;
  kind: Kind;
  detail: string;
  files: string[];
}

function photo(prefix: string, number: number): string {
  return number === 0 ? `${prefix}.webp` : `${prefix} (${number}).webp`;
}

const ITEMS: ImportItem[] = [
  // ── Blouse (Atasan) ──────────────────────────────────────────
  {
    key: "blouse-lace-putih",
    name: "Blouse Lace Putih",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna putih dengan detail lace di seluruh bagian",
    files: [photo(BLOUSE, 1)],
  },
  {
    key: "blouse-babydoll-pink",
    name: "Blouse Babydoll Pink",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna pink dengan potongan babydoll dan lengan puff",
    files: [photo(BLOUSE, 2)],
  },
  {
    key: "blouse-lace-krem",
    name: "Blouse Lace Krem",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna krem dengan detail lace dan kancing di bagian depan",
    files: [photo(BLOUSE, 3)],
  },
  {
    key: "blouse-peach-drawstring",
    name: "Blouse Peach Drawstring",
    price: 40000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna peach dengan kancing depan dan tali di bagian pinggang",
    files: [photo(BLOUSE, 4)],
  },
  {
    key: "blouse-motif-hati-ungu",
    name: "Blouse Motif Hati Ungu",
    price: 40000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "motif hati ungu dengan aksen lace di bagian bawah",
    files: [photo(BLOUSE, 5)],
  },
  {
    key: "blouse-coral-button",
    name: "Blouse Coral Button",
    price: 35000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna coral dengan kancing depan dan tali leher",
    files: [photo(BLOUSE, 6)],
  },
  {
    key: "blouse-ruffle-hitam",
    name: "Blouse Ruffle Hitam",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna hitam dengan detail ruffle di bagian lengan",
    files: [photo(BLOUSE, 7)],
  },
  {
    key: "blouse-smocked-merah",
    name: "Blouse Smocked Merah",
    price: 40000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna merah dengan detail smocked di bagian dada",
    files: [photo(BLOUSE, 8)],
  },
  {
    key: "blouse-floral-pink",
    name: "Blouse Floral Pink",
    price: 40000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "motif floral pink di atas bahan putih dengan lengan puff",
    files: [photo(BLOUSE, 9)],
  },
  {
    key: "blouse-sage-tie-front",
    name: "Blouse Sage Tie Front",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "warna sage dengan tali di bagian depan",
    files: [photo(BLOUSE, 10)],
  },
  {
    key: "blouse-floral-cokelat",
    name: "Blouse Floral Cokelat",
    price: 40000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "motif floral cokelat dengan potongan longgar",
    files: [photo(BLOUSE, 11)],
  },
  {
    key: "blouse-floral-navy",
    name: "Blouse Floral Navy",
    price: 45000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "motif floral besar di atas bahan navy",
    files: [photo(BLOUSE, 12)],
  },
  {
    key: "blouse-floral-kuning",
    name: "Blouse Floral Kuning",
    price: 50000,
    category: "Atasan",
    size: "All size",
    kind: "blouse",
    detail: "motif floral kuning dengan kerah lebar dan tali depan",
    files: [photo(BLOUSE, 0)],
  },

  // ── Cardigan & sweater (Outerwear) ───────────────────────────
  {
    key: "cardigan-rajut-pink",
    name: "Cardigan Rajut Pink",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna pink dengan tepi putih dan motif pita",
    files: [photo(CARDIGAN, 0)],
  },
  {
    key: "cardigan-rajut-biru",
    name: "Cardigan Rajut Biru",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna putih dengan motif biru dan aksen biru di tepi",
    files: [photo(CARDIGAN, 1)],
  },
  {
    key: "cardigan-rajut-hijau",
    name: "Cardigan Rajut Hijau",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna hijau dengan motif hati hitam",
    files: [photo(CARDIGAN, 2), photo(CARDIGAN, 3)],
  },
  {
    key: "cardigan-monogram-navy",
    name: "Cardigan Monogram Navy",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna navy dengan motif monogram putih",
    files: [photo(CARDIGAN, 4)],
  },
  {
    key: "cardigan-leopard-biru",
    name: "Cardigan Leopard Biru",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna biru muda dengan motif leopard",
    files: [photo(CARDIGAN, 5)],
  },
  {
    key: "sweater-rajut-leopard-abu",
    name: "Sweater Rajut Leopard Abu",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "sweater",
    detail: "warna abu-abu dengan motif leopard cokelat dan potongan crew neck",
    files: [photo(CARDIGAN, 6)],
  },
  {
    key: "cardigan-polkadot-merah",
    name: "Cardigan Polkadot Merah",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna merah dengan motif polkadot putih dan tepi putih",
    files: [photo(CARDIGAN, 7)],
  },
  {
    key: "cardigan-stripe-hitam-putih",
    name: "Cardigan Stripe Hitam Putih",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna hitam dengan stripe putih di bagian bawah",
    files: [photo(CARDIGAN, 8)],
  },
  {
    key: "cardigan-argyle-pink",
    name: "Cardigan Argyle Pink",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "motif argyle pink dan hitam",
    files: [photo(CARDIGAN, 9)],
  },
  {
    key: "cardigan-damask-merah",
    name: "Cardigan Damask Merah",
    price: 75000,
    category: "Outerwear",
    size: "All size",
    kind: "cardigan",
    detail: "warna merah dengan motif damask putih",
    files: [photo(CARDIGAN, 10)],
  },

  // ── Daster & piyama (Dress) ──────────────────────────────────
  {
    key: "daster-floral-biru",
    name: "Daster Floral Biru",
    price: 95000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif floral biru dan pink",
    files: [photo(DASTER, 1)],
  },
  {
    key: "daster-floral-oranye",
    name: "Daster Floral Oranye",
    price: 90000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif floral oranye",
    files: [photo(DASTER, 2)],
  },
  {
    key: "daster-floral-merah",
    name: "Daster Floral Merah",
    price: 95000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif floral merah dengan potongan longgar",
    files: [photo(DASTER, 3)],
  },
  {
    key: "daster-putih-ribbon",
    name: "Daster Putih Ribbon",
    price: 100000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "warna putih dengan motif pita pink",
    files: [photo(DASTER, 4)],
  },
  {
    key: "daster-floral-pink",
    name: "Daster Floral Pink",
    price: 90000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif floral pink",
    files: [photo(DASTER, 5)],
  },
  {
    key: "daster-floral-colorful",
    name: "Daster Floral Colorful",
    price: 95000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif floral warna-warni",
    files: [photo(DASTER, 6)],
  },
  {
    key: "daster-tie-dye-pastel",
    name: "Daster Tie Dye Pastel",
    price: 100000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "motif tie-dye pastel",
    files: [photo(DASTER, 7)],
  },
  {
    key: "stelan-piyama-polkadot-navy",
    name: "Stelan Piyama Polkadot Navy",
    price: 135000,
    category: "Dress",
    size: "All size",
    kind: "piyama",
    detail: "warna navy dengan motif polkadot putih",
    files: [photo(DASTER, 8)],
  },
  {
    key: "daster-putih-pita-pink",
    name: "Daster Putih Pita Pink",
    price: 105000,
    category: "Dress",
    size: "All size",
    kind: "daster",
    detail: "warna putih dengan motif pita dan hati pink",
    files: [photo(DASTER, 0)],
  },
];

function describe(item: ImportItem): string {
  const closing =
    "Foto diambil apa adanya tanpa filter warna. Ukuran aktual belum diukur — silakan tanyakan via WhatsApp sebelum checkout.";
  if (item.kind === "blouse") {
    return `Blouse preloved ${item.detail}. Bahan ringan dan nyaman dipakai harian. ${closing}`;
  }
  if (item.kind === "cardigan") {
    return `Cardigan rajut preloved ${item.detail}. Rajutan hangat dengan potongan relaxed, cocok untuk layering. ${closing}`;
  }
  if (item.kind === "sweater") {
    return `Sweater rajut preloved ${item.detail}. Rajutan hangat dan nyaman untuk cuaca sejuk. ${closing}`;
  }
  if (item.kind === "piyama") {
    return `Stelan piyama preloved ${item.detail}, terdiri dari atasan dan bawahan. Bahan nyaman untuk tidur maupun santai di rumah. ${closing}`;
  }
  return `Daster preloved ${item.detail}. Bahan adem dan longgar, nyaman dipakai di rumah. ${closing}`;
}

interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  size: string;
  category: string;
  description: string;
  defectNotes: string | null;
  images: string[];
  status: boolean;
  createdBy: string | null;
  requestId: string | null;
}

interface UploadManifest {
  [key: string]: string[];
}

function configureCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Kredensial Cloudinary belum lengkap di .env.local.");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return { cloudName, apiKey, apiSecret };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function uniqueAssets(urls: string[]): number {
  return new Set(urls.map((url) => url.replace(/\/v\d+\//, "/"))).size;
}

async function uploadFile(item: ImportItem, file: string, index: number): Promise<string> {
  const filePath = path.join(IMAGE_DIR, file);
  const buffer = await fs.readFile(filePath);
  const dataUri = `data:image/webp;base64,${buffer.toString("base64")}`;
  const suffix = item.files.length > 1 ? `-${index + 1}` : "";
  const publicId = `prelovedsaerawatt/products/${item.key}${suffix}`;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        tags: "prelovedsaerawatt,import-2026-10",
      });
      return result.secure_url;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

async function main() {
  configureCloudinary();

  const existingManifest = await readJson<UploadManifest>(UPLOAD_MANIFEST, {});
  const manifest: UploadManifest = {};
  const failures: string[] = [];
  let uploaded = 0;
  let reused = 0;

  for (const [index, item] of ITEMS.entries()) {
    const cached = existingManifest[item.key];
    if (
      cached &&
      cached.length === item.files.length &&
      uniqueAssets(cached) === item.files.length
    ) {
      manifest[item.key] = cached;
      reused += cached.length;
      console.log(
        `[${index + 1}/${ITEMS.length}] ${item.name} — pakai URL lama (${cached.length} foto)`,
      );
      continue;
    }

    const urls: string[] = [];
    for (const [fileIndex, file] of item.files.entries()) {
      try {
        const url = await uploadFile(item, file, fileIndex);
        urls.push(url);
        uploaded += 1;
        console.log(`[${index + 1}/${ITEMS.length}] ${item.name} — upload ${file}`);
      } catch (error) {
        failures.push(
          `${item.name}: ${file} (${error instanceof Error ? error.message : String(error)})`,
        );
        console.error(`[${index + 1}/${ITEMS.length}] GAGAL ${item.name} — ${file}`);
      }
    }
    if (urls.length === item.files.length) {
      manifest[item.key] = urls;
      await fs.writeFile(UPLOAD_MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
    }
  }

  if (failures.length) {
    console.error(`\n${failures.length} foto gagal diupload:`);
    for (const failure of failures) console.error(`- ${failure}`);
    throw new Error("Upload belum lengkap. Perbaiki error di atas lalu jalankan ulang script.");
  }

  // Bersihkan upload percobaan.
  try {
    await cloudinary.uploader.destroy("prelovedsaerawatt/products/test-blouse-lace-putih");
  } catch {
    // abaikan
  }

  const stored = await readJson<Product[]>(PRODUCTS_FILE, []);
  const importedSlugs = new Set(
    ITEMS.map((item) => slugify(item.name, { lower: true, strict: true, trim: true })),
  );
  const kept = stored.filter((product) => !importedSlugs.has(product.slug));

  const now = Date.now();
  const existingSkus = kept.map((product) => product.sku);
  const prefix = `PSW-${new Date().toISOString().slice(2, 4)}${String(new Date().getMonth() + 1).padStart(2, "0")}-`;
  let sequence = existingSkus
    .filter((sku) => sku.startsWith(prefix))
    .reduce((max, sku) => Math.max(max, Number.parseInt(sku.slice(prefix.length), 10) || 0), 0);

  const created: Product[] = ITEMS.map((item, index) => {
    sequence += 1;
    const slug = slugify(item.name, { lower: true, strict: true, trim: true });
    const createdAt = new Date(now - index * 60_000).toISOString();
    return {
      id: randomUUID(),
      createdAt,
      updatedAt: createdAt,
      name: item.name,
      slug,
      sku: `${prefix}${String(sequence).padStart(3, "0")}`,
      price: item.price,
      size: item.size,
      category: item.category,
      description: describe(item),
      defectNotes: null,
      images: manifest[item.key],
      status: true,
      createdBy: null,
      requestId: randomUUID(),
    };
  });

  await fs.writeFile(PRODUCTS_FILE, JSON.stringify([...created, ...kept], null, 2), "utf8");

  const csvRows = [
    ["sku", "name", "category", "price", "size", "photos", "cloudinary_urls", "defect_notes"],
    ...created.map((product) => [
      product.sku,
      product.name,
      product.category,
      String(product.price),
      product.size,
      String(product.images.length),
      product.images.join(" | "),
      product.defectNotes ?? "",
    ]),
  ];
  const csv = csvRows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  await fs.writeFile(SUMMARY_CSV, `${csv}\n`, "utf8");

  console.log(
    `\nSelesai: ${created.length} produk dibuat, ${uploaded} foto baru diupload, ${reused} foto dipakai ulang.`,
  );
  console.log(`Katalog: ${path.relative(ROOT, PRODUCTS_FILE)}`);
  console.log(`Ringkasan: ${path.relative(ROOT, SUMMARY_CSV)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
