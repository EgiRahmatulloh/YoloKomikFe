import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { languages } from './constants/languages'

// URL API sekarang adalah "jembatan" lokal kita yang aman.
// Saat di-deploy di Vercel, ini akan secara otomatis menunjuk ke Serverless Function.
const LOCAL_API_URL = '/api/translate';

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [targetLanguage, setTargetLanguage] = useState('en-US')
  const [originalImage, setOriginalImage] = useState('')
  const [translatedImage, setTranslatedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      setTranslatedImage('')
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTranslate = async () => {
    if (!selectedFile) {
      setError('Please select an image file.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1]
        
        // ==========================================================
        // PERUBAHAN UTAMA: Memanggil API Route lokal kita (/api/translate),
        // bukan lagi API Hugging Face secara langsung.
        // ==========================================================
        const response = await axios.post(LOCAL_API_URL, {
          image: base64Image,
          target_lang: targetLanguage
        });

        setTranslatedImage(`data:image/jpeg;base64,${response.data.image}`)
        setIsLoading(false)
      }
      reader.readAsDataURL(selectedFile)
    } catch (err) {
      // Menangkap pesan error yang lebih jelas dari "jembatan" kita
      setError(err.response?.data?.message || 'An error occurred during translation')
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (translatedImage) {
      const link = document.createElement('a')
      link.href = translatedImage
      link.download = `MangaTranslator-${new Date().toISOString().replace(/[^\w\s]/gi, '-')}.jpg`
      link.click()
    }
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>Manga Translator</h1>
          <p>
            Translate your manga panels from <strong>Japanese</strong> to <strong>English</strong>!
          </p>
          <p>
            Make sure the image is clear, black and white, and has text in Japanese.
          </p>
          <a
            href="https://github.com/Detopall/manga-translator"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <div className="container">
        <div className="actions">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="language-select"
          >
            {Object.entries(languages).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <button
            onClick={handleTranslate}
            disabled={isLoading || !selectedFile}
            className="translate-button"
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>

          {translatedImage && (
            <button onClick={handleDownload} className="download-button">
              Download Translated Image
            </button>
          )}
        </div>

        {isLoading && <div className="spinner"></div>}
        
        {error && <div className="error">{error}</div>}

        <div className="images-container">
          <div className="image-wrapper">
            <h3>Original Image</h3>
            {originalImage && (
              <img src={originalImage} alt="Original" className="image" />
            )}
          </div>
          
          <div className="image-wrapper">
            <h3>Translated Image</h3>
            {translatedImage && (
              <img src={translatedImage} alt="Translated" className="image" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App