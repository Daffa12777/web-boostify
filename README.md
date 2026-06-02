# 🐝 Boostify — Backend

Server API untuk sistem absensi otomatis berbasis pengenalan wajah **Boostify**.

🔗 **Live:** [web-boostify.vercel.app](https://web-boostify.vercel.app)

---

## ✨ Fitur

- 🔐 Login & Register dengan JWT
- 👤 Data profil pengguna
- 📸 Upload & hapus foto profil (ImageKit)
- 📋 Rekap & riwayat absensi
- 📡 Terima data absensi dari Raspberry Pi (ML)
- 🔑 Reset password via kode verifikasi
- 🚫 Blacklist token (logout aman)

---

## 🛠️ Teknologi

| Teknologi | Fungsi |
|---|---|
| Express.js | Framework API |
| Prisma ORM | Database query |
| Supabase PostgreSQL | Database |
| ImageKit | Penyimpanan foto |
| bcryptjs | Hash password |
| JWT | Autentikasi token |

---

## 📁 Struktur Folder

```
BOOSTIFY-BackEnd/
├── prisma/
│   └── schema.prisma          ← struktur database
│
├── src/
│   ├── config/
│   │   └── imagekit.js        ← konfigurasi ImageKit
│   │
│   ├── features/
│   │   ├── auth/              ← login, register, logout, reset password
│   │   ├── whoami/            ← data profil pengguna
│   │   ├── personalrecords/   ← riwayat absensi pribadi
│   │   ├── live_attendance/   ← data absensi realtime
│   │   ├── recap/             ← rekap & terima data dari ML
│   │   ├── uploadImage/       ← upload & hapus foto
│   │   └── tokenCleanup/      ← bersihkan token expired
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js  ← validasi JWT
│   │
│   ├── routes/
│   │   └── routes.js          ← semua endpoint
│   │
│   └── index.js               ← entry point server
│
└── .env                       ← konfigurasi environment
```

---

## 🚀 Cara Menjalankan (Lokal)

### 1. Clone & Install

```bash
git clone https://github.com/Daffa12777/web-boostify.git
cd web-boostify
npm install
```

### 2. Buat File `.env`

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=isi_jwt_secret
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
```

### 3. Jalankan

```bash
npm run dev
```

Server berjalan di: [http://localhost:3000](http://localhost:3000)

---

## 📡 Daftar Endpoint API

### Auth
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/register` | Register | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| POST | `/api/request-verification` | Kirim kode verifikasi | ❌ |
| POST | `/api/verify-change-password` | Verifikasi kode | ❌ |
| PATCH | `/api/reset-password` | Reset password | ❌ |
| PATCH | `/api/auth/updatePassword` | Ganti password | ✅ |

### Profil & Foto
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| GET | `/api/whoami` | Data profil sendiri | ✅ |
| PATCH | `/api/uploadImage` | Upload foto profil | ✅ |
| DELETE | `/api/deleteImage` | Hapus foto profil | ✅ |

### Absensi
| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| GET | `/api/attendances` | Data absensi realtime | ✅ |
| GET | `/api/personalrec` | Riwayat absensi pribadi | ✅ |
| GET | `/api/recap` | Rekap absensi | ✅ |
| POST | `/api/uploadfromml` | Terima data dari Raspberry Pi | ❌ |

> ✅ = Butuh token JWT di header `Authorization: Bearer <token>`

---

## 🗄️ Struktur Database

### Tabel `Assisstant`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int | Primary key |
| assisstant_code | String | Kode unik (contoh: FDR) |
| name | String | Nama lengkap |
| password | String | Password (hashed bcryptjs) |
| imageUrl | String? | URL foto profil |
| email | String? | Email |
| verification_code | String? | Kode reset password |

### Tabel `Attendance`
| Kolom | Tipe | Keterangan |
|---|---|---|
| uuid | String | Primary key |
| assisstant_code | String | Kode asisten |
| name | String | Nama |
| time | DateTime | Waktu absen |

### Tabel `BlacklistedToken`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | Int | Primary key |
| token | String | Token yang sudah logout |
| createdAt | DateTime | Waktu blacklist |

---

## 🌐 Environment Variables (Vercel)

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Supabase |
| `DIRECT_URL` | Direct connection Supabase |
| `JWT_SECRET` | Secret untuk sign JWT |
| `IMAGEKIT_PUBLIC_KEY` | Public key ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | Private key ImageKit |
| `IMAGEKIT_URL_ENDPOINT` | URL endpoint ImageKit |

---

## 🔗 Repository Terkait

| Repo | Link |
|---|---|
| Frontend | [github.com/Daffa12777/frontend-boostify](https://github.com/Daffa12777/frontend-boostify) |
| ML | [github.com/Daffa12777/boostify-ml](https://github.com/Daffa12777/boostify-ml) |

---

*Boostify — Smart Attendance for Smart Campus* 🐝