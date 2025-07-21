# Table of Content

- [Pre Requisite](#pre-requisite)
- [Manual Quick Start API](#manual-quick-start-api)

# Pre Requisite

- NodeJs v18+
- pnpm

# Manual Quick Start API

- buat file .env lalu copy semua yang ada pada .env.template
- buka `https://console.cloud.google.com/` untuk membuat service account key
  untuk kebutuhan firestore admin
- buka `manage your google account` pada browser, lalu pilih security dan aktifkan 2-step verification
  lalu pada pencarian cari "kunci aplikasi" atau "app key" untuk membuat app key yang digunakan untuk nodemailer
- jalankan `pnpm install` untuk menginstall package
- jalankan `pnpm run build` untuk melakukan build project
- jalankan `npm run start:dev` untuk mode watch dan `npm run start:prod` untuk run aplikasi dari hasil build
