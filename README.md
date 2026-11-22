# HANZPIW OFFICIAL

Static site + 1 serverless function (Vercel).

## Deploy
1. Push folder ini ke GitHub → Import di Vercel (tanpa build command).
2. Visitor counter: Vercel → Storage → tambah **Upstash Redis**, lalu connect ke project (env otomatis terisi) dan redeploy. Tanpa ini counter menampilkan "—" (tidak ada angka palsu).
3. Isi link WhatsApp di `assets/app.js` → `CONFIG` (`wa_ann`, `wa_channel`).
4. Tambah pengumuman: edit array `UPDATES` di `assets/app.js`.
5. Ganti `hanzpiw-official.vercel.app` di `index.html` dengan domain asli, dan tambahkan `og.png` (1200×630) untuk social preview.
