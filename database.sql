-- ╔══════════════════════════════════════════════════════════════════╗
-- ║   DATABASE PROGRAM LES KOMPUTER — SIAP UPLOAD KE NEON ✅          ║
-- ╚══════════════════════════════════════════════════════════════════╝
--
-- CARA UPLOAD KE NEON (2 menit):
-- 1. Buka https://neon.tech → login → klik project database Anda
-- 2. Di menu kiri, klik "SQL Editor"
-- 3. Copy SELURUH isi file ini (Ctrl+A lalu Ctrl+C)
-- 4. Paste ke kotak SQL Editor → klik tombol "Run"
-- 5. Selesai! Database "programs" langsung berisi 3 program les.
--    (Lihat hasilnya di menu "Tables" → tabel "programs")
--
-- Catatan:
-- - File ini AMAN dijalankan berulang kali (data tidak akan dobel).
-- - Sebenarnya website juga bisa membuat tabel + mengisi data ini
--   OTOMATIS saat pertama kali tersambung ke Neon. File ini hanya
--   pilihan kalau Anda ingin mengisinya sendiri lebih dulu.
-- - Setelah database jadi, jangan lupa tempel "Connection string"
--   dari Neon ke file src/lib/db-config.ts di repo GitHub Anda.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT NOT NULL,
  topics TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'book',
  seq BIGSERIAL NOT NULL UNIQUE
);

INSERT INTO programs (id, name, level, description, topics, duration, price, icon)
VALUES
  (
    'office',
    'Microsoft Office',
    'Pemula - Menengah',
    'Kuasai aplikasi perkantoran yang paling banyak dibutuhkan di dunia kerja. Cocok untuk pelajar, mahasiswa, dan profesional.',
    '["Microsoft Word (dokumen & laporan)","Microsoft Excel (formula & grafik)","Microsoft PowerPoint (presentasi)","Internet, email & printing"]',
    '24 Sesi',
    'Rp 350.000',
    'office'
  ),
  (
    'programming',
    'Pemrograman',
    'Pemula - Mahir',
    'Belajar coding dari nol dengan pendekatan praktis. Bangun website dan aplikasi pertamamu secara bertahap.',
    '["Dasar logika & algoritma","HTML, CSS & JavaScript","Python untuk pemula","Membangun project web sederhana"]',
    '32 Sesi',
    'Rp 500.000',
    'code'
  ),
  (
    'design',
    'Desain Grafis',
    'Pemula - Menengah',
    'Ciptakan desain yang menarik dengan Photoshop dan CorelDRAW. Cocok untuk usaha, karier kreatif, atau hobi.',
    '["Adobe Photoshop (edit foto)","CorelDRAW (vektor & layout)","Desain logo & branding","Desain poster & media sosial"]',
    '28 Sesi',
    'Rp 450.000',
    'design'
  )
ON CONFLICT (id) DO NOTHING;
