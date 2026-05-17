import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: '', menu: 'meat', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with your Render/Railway URL after deployment
    const response = await fetch('http://localhost:5000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) setSubmitted(true);
  };

  return (
    <div className="timeless-wrapper">
      {/* SECTION 1: HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          {/* Label transition: Fades in from above */}
          <motion.p 
            className="hero-label"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ПОКАНА ЗА СВАТБА
          </motion.p>

          {/* Names transition: Fades in and scales up slightly */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Виктория & Петьо
          </motion.h1>

          {/* Divider transition: Expands from the center */}
          <motion.div 
            className="gold-line"
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          ></motion.div>

          {/* Date transition: Fades in from below */}
          <motion.p 
            className="hero-date"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          >
            23 АВГУСТ 2026 | 16:00 ч.
          </motion.p>
        </div>
      </section>

      {/* STICKY NAVIGATION */}
      <nav className="sticky-nav">
        <a href="#home">НАЧАЛО</a>
        <a href="#details">ДЕТАЙЛИ</a>
        <a href="#location">ЛОКАЦИЯ</a>
        <a href="#rsvp">ПОТВЪРЖДЕНИЕ</a>
      </nav>

      {/* SECTION 2: INTRO & PHOTO */}
      <section className="info-section" id="details">
        <div className="container">
          <div className="text-block">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} // Only animates the first time you see it
              transition={{ duration: 0.8 }}
            >
              Скъпи роднини и приятели,
            </motion.h2>
            <p className="main-text">
              С голямо вълнение и радост ви каним да споделите с нас началото на нашето съвместно приключение! 
              Вашето присъствие ще направи този ден незабравим.
            </p>
          </div>
          
          <div className="image-wrap">
            <img src="https://raw.githubusercontent.com/petyonachev92/wedding_website/refs/heads/main/client/public/images/MPN03337.JPG" alt="Wedding Couple" className="mid-photo" />
          </div>
        </div>
      </section>


      {/* SECTION 3: CALENDAR */}
      <section className="calendar-section">
        <div className="container">
          <h2 className="section-title">Запазете датата</h2>
          <div className="calendar-card">
            <div className="calendar-header">
              <h3>АВГУСТ 2026</h3>
            </div>
            <div className="calendar-grid">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
                <div key={day} className="calendar-day-label">{day}</div>
              ))}
              
              {/* Empty slots for August 2026 (Starts on Saturday) */}
              {[...Array(5)].map((_, i) => <div key={`empty-${i}`} className="empty"></div>)}
              
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isWeddingDay = day === 23;
                return (
                  <div key={day} className="calendar-date-wrapper">
                    <div className={`calendar-date ${isWeddingDay ? 'wedding-day' : ''}`}>
                      {day}
                      {isWeddingDay && (
                        <motion.div 
                          className="ring-marker"
                          initial={{ scale: 0, opacity: 0, rotate: -45 }}
                          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                        >
                          {/* Visual Ring Shape using CSS */}
                          <div className="diamond"></div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROGRAM & PARALLAX IMAGE */}
      <section className="parallax-divider"></section>

      <section className="program-section">
        <div className="container">
          <h2 className="section-title">Програма</h2>
          <p className="location-text">„Галени градини“, с. Войнеговци</p>
          
          <div className="timeline-list">
            <div className="t-item"><span>16:00 ч.</span><p>Welcome Drink</p></div>
            <div className="t-item"><span>16:30 ч.</span><p>Изнесен ритуал</p></div>
            <div className="t-item"><span>17:15 ч.</span><p>Коктейл и снимки</p></div>
            <div className="t-item"><span>18:30 ч.</span><p>Начало на вечерята</p></div>
            <div className="t-item"><span>21:30 ч.</span><p>Торта и изненади</p></div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LOCATION */}
      <section className="location-section" id="location">
        <div className="container">
          <h2 className="section-title">Локация</h2>
          <p className="location-name">Галени градини, с. Войнеговци</p>
          <p className="location-address">ул. „Стара планина“ 24, 1222 София</p>

          <div className="map-wrapper">
            <iframe 
              title="Wedding Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d22313.246216670952!2d23.4072791!3d42.794809!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8d3402d90805%3A0x9d6bde97e4d424f6!2z0JPQsNC70LXQvdC4INCz0YDQsNC00LjQvdC4IC0g0LzRj9GB0YLQviDQt9CwINGC0YrRgNC20LXRgdGC0LLQsA!5e1!3m2!1sbg!2sbg!4v1778532202710!5m2!1sbg!2sbg"
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <a 
            href="https://maps.app.goo.gl/byAurQpv8XBwcn378" /* Replace with the actual Google Maps share link */
            target="_blank" 
            rel="noopener noreferrer"
            className="directions-btn"
          >
            ОТВОРИ В GOOGLE MAPS
          </a>
        </div>
      </section>

      {/* SECTION 6: RSVP */}
      <section className="rsvp-section" id="rsvp">
        <div className="container rsvp-container">
          <div className="rsvp-box">
            <h2 className="section-title">Потвърждение</h2>
            <p className="rsvp-deadline">Молим да потвърдите вашето присъствие до 01.07.2026 г.</p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="elegant-form">
                <input type="text" placeholder="Вашите имена" required onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <select required onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="">Ще присъствате ли?</option>
                  <option value="yes">С удоволствие ще дойда!</option>
                  <option value="no">За съжаление, няма да успея</option>
                </select>

                <select onChange={e => setFormData({...formData, menu: e.target.value})}>
                  <option value="meat">Класическо меню</option>
                  <option value="veggie">Вегетарианско меню</option>
                  <option value="kids">Детско меню</option>
                </select>

                <textarea placeholder="Бележки или алергии..." onChange={e => setFormData({...formData, message: e.target.value})} />
                
                <button type="submit" className="gold-btn">ИЗПРАТИ</button>
              </form>
            ) : (
              <div className="success-message">
                <h3>Благодарим ви!</h3>
                <p>Очакваме ви с нетърпение!</p>
              </div>
            )}
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