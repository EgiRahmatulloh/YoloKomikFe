# Manga Translator Frontend

Frontend React aplikasi Manga Translator menggunakan Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

## Features

- Upload gambar manga
- Pilih bahasa target untuk terjemahan
- Preview gambar asli dan hasil terjemahan
- Download gambar yang sudah diterjemahkan
- Responsive design

## Tech Stack

- React 18
- Vite
- Axios untuk HTTP requests
- CSS3 untuk styling

## API Integration

Frontend berkomunikasi dengan backend melalui proxy configuration di Vite yang mengarahkan `/api/*` ke `http://localhost:8000`.