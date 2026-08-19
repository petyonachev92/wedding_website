import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// DIRECT GOOGLE DRIVE RESUMABLE UPLOADER COMPONENT (MULTIPLE FILES)
const PhotoUploaderSection = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setStatus('Подготовка за качване...');
    setProgress(0);

    let uploadedBytesTotal = 0;
    const totalBytesAllFiles = files.reduce((acc, f) => acc + f.size, 0);

    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwloYt6diWwEkF2mwuffIQP1tZCu8D2qzrGPb5-AM_PdpMJ3tGTxw9LVzlP38Cgq2lk/exec'; 
      
      // Loop through each selected file one by one
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        setStatus(`Качване на файл ${i + 1} от ${files.length}...`);

        // Step 1: Initialize resumable session for the current file
        const initResponse = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' }, 
          body: JSON.stringify({
            fileName: currentFile.name,
            mimeType: currentFile.type || 'application/octet-stream',
            fileSize: currentFile.size
          })
        });

        const initData = await initResponse.json();
        if (initData.status !== 'success') throw new Error(initData.message);

        const resumableUrl = initData.resumableUrl;
        const chunkSize = 30 * 1024 * 1024; // 30MB chunks

        // Step 2: Upload in chunks sequentially
        for (let start = 0; start < currentFile.size; start += chunkSize) {
          const end = Math.min(start + chunkSize, currentFile.size);
          const chunk = currentFile.slice(start, end);

          const uploadResponse = await fetch(resumableUrl, {
            method: 'PUT',
            headers: {
              'Content-Range': `bytes ${start}-${end - 1}/${currentFile.size}`
            },
            body: chunk
          });

          if (!uploadResponse.ok && uploadResponse.status !== 308) {
             throw new Error(`Връзката беше прекъсната при файл: ${currentFile.name}`);
          }

          // Update total progress bar
          uploadedBytesTotal += (end - start);
          setProgress(Math.round((uploadedBytesTotal / totalBytesAllFiles) * 100));
        }
      }

      setStatus('Всички файлове са качени успешно! Благодарим ви за споделените спомени!');
      setFiles([]);
      const fileInput = document.getElementById('wedding-file-input');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error(err);
      setStatus(`Грешка при качване: ${err.message || 'Моля, опитайте отново'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rsvp-section" id="photos">
      <div className="container rsvp-container">
        <div className="rsvp-box">
          <h2 className="section-title">Снимки & Видеа</h2>
          <p className="rsvp-deadline">
            Бъдете нашите фотографи! Споделете вашите снимки и видеа от празничния ден директно с нас.
          </p>

          <form onSubmit={handleUpload} className="elegant-form">
            <div className="guest-row-card">
              <div className="guest-fields-stack">
                <div className="form-field-row">
                  <input
                    id="wedding-file-input"
                    type="file"
                    multiple // ALLOWS MULTIPLE FILES TO BE SELECTED
                    accept="image/*,video/*"
                    disabled={isUploading}
                    onChange={(e) => setFiles(Array.from(e.target.files))} // CONVERT TO ARRAY
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#fff',
                      cursor: isUploading ? 'not-allowed' : 'pointer'
                    }}
                  />
                </div>

                {files.length > 0 && (
                  <div style={{ marginTop: '12px', textAlign: 'left', fontSize: '0.88rem', color: '#555' }}>
                    <strong>Избрани файлове: {files.length}</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px', marginBottom: '0', maxHeight: '100px', overflowY: 'auto' }}>
                      {files.map((f, index) => (
                        <li key={index}>{f.name} ({(f.size / (1024 * 1024)).toFixed(1)} MB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {progress > 0 && (
              <div style={{
                width: '100%',
                backgroundColor: '#EFEFEF',
                borderRadius: '8px',
                height: '10px',
                margin: '15px 0',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: '#C5A059',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}

            {status && (
              <p style={{
                textAlign: 'center',
                margin: '12px 0',
                fontSize: '0.95rem',
                color: status.includes('успешно') ? '#2e7d32' : '#444'
              }}>
                {status}
              </p>
            )}

            <button 
              type="submit" 
              className="gold-btn" 
              disabled={files.length === 0 || isUploading}
              style={{
                opacity: (files.length === 0 || isUploading) ? 0.6 : 1,
                cursor: (files.length === 0 || isUploading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? `КАЧВАНЕ (${progress}%)...` : 'КАЧИ ФАЙЛОВЕ'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="timeless-wrapper">
      {/* SECTION 1: HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <motion.p 
            className="hero-label"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ПОКАНА ЗА СВАТБАТА НА
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Виктория & Петьо
          </motion.h1>

          <motion.div 
            className="gold-line"
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          ></motion.div>

          <motion.p 
            className="hero-date"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          >
            23 АВГУСТ 2026
          </motion.p>
        </div>
      </section>

      {/* FLOATING & RESPONSIVE NAVIGATION SYSTEM */}
      <nav className={`sticky-nav ${menuOpen ? 'mobile-nav-active' : ''}`}>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Navigation">
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </button>

        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>НАЧАЛО</a>
          <a href="#photos" onClick={() => setMenuOpen(false)}>СНИМКИ</a>
          <a href="#location" onClick={() => setMenuOpen(false)}>ЛОКАЦИЯ</a>
          <a href="#program" onClick={() => setMenuOpen(false)}>ПРОГРАМА</a>
        </div>
      </nav>

      {/* SECTION 2: PHOTO & VIDEO UPLOADER */}
      <PhotoUploaderSection />

      {/* SECTION 3: LOCATION */}
      <section className="location-section" id="location">
        <div className="container">
          <h2 className="section-title">Локация</h2>
          <p className="location-name">"Галени градини", с. Войнеговци</p>

          <div 
            className="map-image-card" 
            onClick={() => window.open('https://maps.app.goo.gl/byAurQpv8XBwcn378', '_blank')}
          >
            <div className="map-card-overlay">
              <span>КЛИКНЕТЕ ЗА НАВИГАЦИЯ</span>
            </div>
            <img 
              src="https://i0.wp.com/www.galeni-gradini.com/wp-content/uploads/2020/01/%D1%81%D0%B2%D0%B0%D1%82%D0%B1%D0%B8-%D0%BD%D0%B0-%D0%BE%D1%82%D0%BA%D1%80%D0%B8%D1%82%D0%BE-%D1%81%D0%BE%D1%84%D0%B8%D1%8F.jpg" 
              alt="Галени градини" 
              className="map-card-img" 
            />
          </div>

          <div className="location-instructions">
            <p>
              📍 Достъп с автомобил:
              <br />До мястото може да се стигне по два маршрута – през с. Локорско и през с. Войнеговци.
              Препоръчваме маршрута през с. Локорско.
            </p>

            <p>
              🚕 Достъп с такси:<br />
              Такси компаниите в София превозват до мястото на стандартна тарифа.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROGRAM */}
      <section className="program-section" id="program">
        <div className="container">
          <h2 className="section-title">Програма</h2>
          <p className="location-text">„Галени градини“, с. Войнеговци</p>
          
          <div className="timeline-list">
            <div className="t-item"><span>16:00 ч.</span><p>Welcome Drink</p></div>
            <div className="t-item"><span>16:30 ч.</span><p>Изнесен ритуал</p></div>
            <div className="t-item"><span>17:00 ч.</span><p>Поздравления и снимки</p></div>
            <div className="t-item"><span>18:00 ч.</span><p>Начало на празненството</p></div>
            <div className="t-item"><span>21:30 ч.</span><p>Разрязване на тортата</p></div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>ВИКТОРИЯ & ПЕТЬО</p>
        <span>23.08.2026</span>
      </footer>
    </div>
  );
}

export default App;