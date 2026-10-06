# ✨ ClipCraft — Editor Video Aesthetic

Web editor video client-side yang mengubah video mentah jadi konten aesthetic dengan kombinasi warna, font, dan emoji yang menarik — langsung di browser, tanpa backend.

## 🚀 Fitur
- Upload video (maks 5 menit) via drag & drop
- Kolom brief/konsep → otomatis jadi caption aesthetic di video
- 6 gaya editing preset: Vlog Harian, Aesthetic Minimal, Cinematic, Pop Ceria, Retro Vintage, Neon Glow
- Pilihan rasio: 9:16, 1:1, 4:5, 16:9
- Pilihan resolusi: 720p / 1080p / 4K
- Preview hasil + tombol download MP4

## 📦 Deploy ke GitHub Pages

1. Buat repo baru di GitHub, misal `clipcraft`.
2. Upload semua file (index.html, css/, js/, .nojekyll, README.md).
3. Buka **Settings → Pages**.
4. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)` → **Save**.
5. Tunggu ±1 menit, buka `https://<username>.github.io/clipcraft/`.

## 🧠 Cara Kerja
Semua editing dilakukan via **Canvas 2D** (filter warna, teks, emoji, letterbox) lalu direkam pakai **MediaRecorder API** langsung jadi file MP4 (atau WebM di browser yang belum mendukung MP4 recorder).

## ⚠️ Catatan Browser
- **Chrome / Edge terbaru** → output `.mp4`
- **Firefox / Safari** → output `.webm` (bisa dikonversi ke MP4 via tools online)

## 📄 Lisensi
MIT — bebas dipakai & dimodifikasi.
