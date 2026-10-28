-- Seed development/local SAJA. Jangan jalankan di production.
-- Production harus mulai dari katalog kosong dan upload foto ke Cloudinary.
-- Foto memakai aset lokal repo agar Supabase local langsung terlihat utuh.

insert into public.products
  (name, slug, price, size, category, description, defect_notes, images, status)
values
  (
    'Aurora Wool Coat',
    'aurora-wool-coat',
    485000,
    'M',
    'Outerwear',
    'Coat wol burgundy dengan potongan straight dan kerah tinggi. Bahan tebal, hangat, dan jatuhnya rapi.',
    'Ada bekas jahitan kecil di bagian dalam lining kiri. Tombol kanan bawah sedikit longgar, sudah dikencangkan.',
    array['/images/products/product-01.jpg'],
    true
  ),
  (
    'Ivory Lace Blouse',
    'ivory-lace-blouse',
    165000,
    'S',
    'Atasan',
    'Blouse ivory dengan detail lace di bagian kerah dan lengan. Ringan, adem, cocok untuk layer atau dipakai langsung.',
    'Serat lace di pergelangan kanan sedikit melebar sekitar 1 cm. Tidak ada noda permanen.',
    array['/images/products/product-02.jpg'],
    true
  ),
  (
    'Camel Wool Coat',
    'camel-wool-coat',
    525000,
    'L',
    'Outerwear',
    'Coat camel dengan siluet relaxed dan saku dalam. Bahan wool blend yang tidak gatal.',
    'Ada sedikit pilling di bagian bawah lengan kiri. Lining utuh, tidak ada robekan.',
    array['/images/products/product-04.jpg'],
    true
  ),
  (
    'Cielo Blue Trench',
    'cielo-blue-trench',
    460000,
    'M',
    'Outerwear',
    'Trench coat biru langit dengan belt dan tali pinggang. Statement piece yang ringan tapi tetap menjaga bentuk.',
    'Belt asli tidak disertakan, diganti tali kain senada. Ada bekas air samar di bagian hem belakang.',
    array['/images/products/product-06.jpg'],
    true
  ),
  (
    'Cream Cable Knit',
    'cream-cable-knit',
    185000,
    'M',
    'Atasan',
    'Sweater rajut cream dengan tekstur cable yang tebal. Bahan lembut dan potongan relaxed.',
    'Bagian ketiak kanan pernah diperbaiki dengan benang senada. Hasil rapi dan tidak terlihat dari luar.',
    array['/images/products/product-07.jpg'],
    true
  ),
  (
    'Denim Button Dress',
    'denim-button-dress',
    210000,
    'M',
    'Dress',
    'Dress denim dengan kancing depan dan potongan flowy di bawah pinggang. Bahan denim lembut, tidak kaku.',
    'Kancing kedua dari atas sedikit longgar. Tidak ada noda atau bagian yang tipis.',
    array['/images/products/product-13.jpg'],
    true
  ),
  (
    'Coral Top-Handle Bag',
    'coral-top-handle-bag',
    320000,
    'All size',
    'Aksesori',
    'Handbag coral dengan handle atas dan strap panjang yang bisa dilepas. Hardware masih mengkilap.',
    'Ada micro-scratch di bagian bawah tas. Tidak terlihat saat dipakai.',
    array['/images/products/product-16.jpg'],
    true
  ),
  (
    'Scarlet Silk Gown',
    'scarlet-silk-gown',
    550000,
    'S',
    'Dress',
    'Gaun merah dengan bahan satin silk blend dan siluet A-line. Pernah dipakai sekali untuk acara formal.',
    'Ada tarikan benang halus di bagian belakang, tidak sampai robek. Tidak ada noda.',
    array['/images/products/product-15.jpg'],
    false
  )
on conflict (slug) do nothing;
