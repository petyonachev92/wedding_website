import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: '', menu: 'meat', message: '' });
  
  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const targetDate = new Date("2026-08-23T16:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          дни: Math.floor(difference / (1000 * 60 * 60 * 24)),
          часа: Math.floor((difference / (1000 * 60 * 60)) % 24),
          мин: Math.floor((difference / 1000 / 60) % 60),
          сек: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Viewport fix script here...
  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    window.addEventListener('resize', setHeight);
    setHeight();
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) setSubmitted(true);
  };

  return (
    <div className="app-viewport">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* FRONT OF CARD */
          <motion.section 
            key="front"
            className="card hero"
            exit={{ y: -1000, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="hero-overlay">
              <h1>Виктория & Петьо</h1>
              <p className="subtitle">Бъдещото семейство Начеви</p>

              <div className="gold-divider"></div>
              <p className="hero-date">23.08.2026 | 16:00 ч.</p>
              <button className="open-btn" onClick={() => setIsOpen(true)}>Отвори поканата</button>
            </div>
          </motion.section>
        ) : (
          /* INSIDE OF CARD - SCROLLABLE CONTENT */
          <motion.div 
            key="inside"
            className="card inside-content"
            initial={{ y: 1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container">
              {/* STYLIZED COUNTDOWN AT THE TOP */}
              <div className="inside-countdown">
                <p className="countdown-title">ОСТАВАТ ОЩЕ:</p>
                <div className="countdown-row">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div className="count-box" key={unit}>
                      <span className="count-num">{value}</span>
                      <span className="count-unit">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="section-title">Детайли за събитието</h2>
              <p>Ще бъдем щастливи да споделите нашия празник в магичната атмосфера на <strong>„Галени градини“</strong>, с. Войнеговци.</p>
              
              <table className="timeline-table">
                <thead>
                  <tr><th>Час</th><th>Събитие</th></tr>
                </thead>
                <tbody>
                  <tr><td>16:00</td><td>Welcome Drink в градината</td></tr>
                  <tr><td>16:30</td><td>Изнесен ритуал</td></tr>
                  <tr><td>17:15</td><td>Коктейл и снимки</td></tr>
                  <tr><td>18:30</td><td>Начало на вечерята</td></tr>
                  <tr><td>21:30</td><td>Торта и изненади</td></tr>
                </tbody>
              </table>

              <div className="rsvp-anchor" id="rsvp">
                <h2 className="section-title">Ще присъствате ли?</h2>
                {!submitted ? (
                  <form className="rsvp-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Вашето име:</label>
                      <input type="text" required placeholder="Две имена..." 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Ще присъствате ли?</label>
                      <select required onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="">Изберете...</option>
                        <option value="yes">С удоволствие ще дойда!</option>
                        <option value="no">За съжаление, няма да успея.</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Избор на меню:</label>
                      <select onChange={e => setFormData({...formData, menu: e.target.value})}>
                        <option value="meat">Класическо (месно)</option>
                        <option value="veggie">Вегетарианско</option>
                        <option value="kids">Детско</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Алергии или коментари:</label>
                      <textarea rows="3" placeholder="Напишете тук..."
                        onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>
                    <button type="submit" className="submit-btn">Изпрати потвърждение</button>
                  </form>
                ) : (
                  <div className="thanks-box">
                    <h3>Благодарим Ви!</h3>
                    <p>Очакваме Ви с нетърпение на 23 Август!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;