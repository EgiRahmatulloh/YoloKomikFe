// File: api/translate.js

// Handler untuk Serverless Function di Vercel.
// Kode ini berjalan di server, BUKAN di browser pengguna.
export default async function handler(request, response) {
  // Hanya izinkan request dengan metode POST
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).send('Method Not Allowed');
  }

  try {
    // 1. Ambil token dan URL rahasia dari Environment Variables yang aman di Vercel
    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    const HF_API_URL = process.env.HF_API_URL;

    // Validasi: Pastikan variabel server sudah diatur di Vercel
    if (!HF_API_TOKEN || !HF_API_URL) {
      console.error("Server configuration error: Missing Hugging Face environment variables.");
      return response.status(500).json({ message: 'Server configuration error. Check Vercel settings.' });
    }
    
    // 2. Ambil data (gambar dan bahasa) yang dikirim dari frontend Anda
    const { image, target_lang } = request.body;
    if (!image) {
      return response.status(400).json({ message: 'Image data is required.' });
    }

    // 3. Panggil API Hugging Face DARI SERVER VERCEL, bukan dari browser.
    //    Sertakan token autentikasi yang aman di header.
    const hfResponse = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: image,
        target_lang: target_lang || 'en-US',
      }),
    });

    // Tangani jika respons dari Hugging Face tidak berhasil (mis. error 4xx atau 5xx)
    const hfResult = await hfResponse.json();
    if (!hfResponse.ok) {
      console.error('Error from Hugging Face API:', hfResult);
      return response.status(hfResponse.status).json(hfResult);
    }
    
    // 4. Kirim kembali hasil yang sukses dari Hugging Face ke frontend
    return response.status(200).json(hfResult);

  } catch (error) {
    console.error('Internal Server Error in /api/translate:', error);
    return response.status(500).json({ message: 'An internal server error occurred.' });
  }
}