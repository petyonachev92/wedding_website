import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// SCREEN-WIDE CONFETTI ENGINE WITH 4-SECOND TIMEOUT
const ConfettiEffect = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const countdown = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(countdown);
  }, []);

  if (!isVisible) return null;

  const pieces = Array.from({ length: 80 }); 
  const colors = ['#C5A059', '#A4C3B2', '#FFFFFF', '#D1E2D9']; 

  return (
    <div className="confetti-container">
      {pieces.map((_, i) => {
        const leftPosition = Math.random() * 100; 
        const dropDelay = Math.random() * 2.5; 
        const fallDuration = 4 + Math.random() * 4; 
        const pieceWidth = 6 + Math.random() * 8;
        const pieceHeight = 10 + Math.random() * 12;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const horizontalDrift = Math.random() * 160 - 80; 
        const isCircleShape = Math.random() > 0.6; 

        return (
          <motion.div
            key={i}
            className="confetti-piece"
            style={{
              left: `${leftPosition}%`,
              width: pieceWidth,
              height: pieceHeight,
              backgroundColor: randomColor,
              borderRadius: isCircleShape ? '50%' : '3px',
            }}
            initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
            animate={{ 
              y: "110vh", 
              x: horizontalDrift, 
              rotate: Math.random() * 1440,
              opacity: [1, 1, 1, 0] 
            }}
            transition={{ 
              duration: fallDuration, 
              ease: "linear", 
              delay: dropDelay,
              repeat: Infinity 
            }}
          />
        );
      })}
    </div>
  );
};

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    guests: [{ name: '', status: '', menu: 'meat' }]
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(false);

    // SANITIZATION SWEEP: Strip menu choices for any non-attending guests
    const sanitizedGuests = formData.guests.map(guest => {
      const guestCopy = { ...guest };
      if (guestCopy.status !== 'yes') {
        delete guestCopy.menu;
      }
      return guestCopy;
    });

    const sanitizedPayload = {
      ...formData,
      guests: sanitizedGuests
    };

    try {
      const response = await fetch('https://wedding-website-1-45ne.onrender.com/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedPayload),
      });

      if (response.ok) {
        setSubmitted(true);
        setSubmitError(false);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      setSubmitError(true);
    }
  };

  const addGuestRow = () => {
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: '', status: '', menu: 'meat' }]
    });
  };

  const removeGuestRow = (index) => {
    const updatedGuests = formData.guests.filter((_, i) => i !== index);
    setFormData({ ...formData, guests: updatedGuests });
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index][field] = value;
    setFormData({ ...formData, guests: updatedGuests });
  };

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
            ПОКАНА ЗА СВАТБА
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
          <a href="#details" onClick={() => setMenuOpen(false)}>ДЕТАЙЛИ</a>
          <a href="#calendar" onClick={() => setMenuOpen(false)}>КАЛЕНДАР</a>
          <a href="#program" onClick={() => setMenuOpen(false)}>ПРОГРАМА</a>
          <a href="#location" onClick={() => setMenuOpen(false)}>ЛОКАЦИЯ</a>
          <a href="#rsvp" onClick={() => setMenuOpen(false)}>ПОТВЪРЖДЕНИЕ</a>
        </div>
      </nav>

      {/* SECTION 2: INTRO & PHOTO */}
      <section className="info-section" id="details">
        <div className="container">
          <div className="text-block">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }}
            >
              Скъпи роднини и приятели,
            </motion.h2>
            <p className="main-text">
              След десет красиви години заедно избираме да превърнем любовта си в още един красив спомен, споделен с хората, които обичаме.
              Затова за нас ще бъде истинско щастие и чест да бъдете до нас в деня, в който ще си кажем „Да“. Вашата подкрепа, смехът 
              и споделените моменти през годините са важна част от нашата история, а присъствието ви на този празник ще го направи наистина незабравимо.
            </p>
          </div>
          
          <div className="image-wrap">
            <img src="https://raw.githubusercontent.com/petyonachev92/wedding_website/refs/heads/main/client/public/images/MPN03337.JPG" alt="Wedding Couple" className="mid-photo" />
          </div>
        </div>
      </section>

      {/* SECTION 3: CALENDAR */}
      <section className="calendar-section" id="calendar">
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

              {[...Array(5)].map((_, i) => <div key={`empty-${i}`} className="empty"></div>)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isWeddingDay = day === 23;
                return (
                  <div key={day} className="calendar-date-wrapper">
                    <div className={`calendar-date ${isWeddingDay ? 'wedding-day' : ''}`}>
                      {day}
                    </div>

                    {isWeddingDay && (
                      <motion.div 
                        className="ring-marker"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="diamond"></div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROGRAM & PARALLAX IMAGE */}
      <section className="parallax-divider"></section>

      <section className="program-section" id="program">
        <div className="container">
          <h2 className="section-title">Програма</h2>
          <p className="location-text">„Галени градини“, с. Войнеговци</p>
          
          <div className="timeline-list">
            <div className="t-item"><span>16:00 ч.</span><p>Welcome Drink</p></div>
            <div className="t-item"><span>16:30 ч.</span><p>Изнесен ритуал</p></div>
            <div className="t-item"><span>17:00 ч.</span><p>Коктейл и снимки</p></div>
            <div className="t-item"><span>18:00 ч.</span><p>Начало на вечерята</p></div>
            <div className="t-item"><span>21:30 ч.</span><p>Торта</p></div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LOCATION */}
      <section className="location-section" id="location">
        <div className="container">
          <h2 className="section-title">Локация</h2>
          <p className="location-name">Галени градини, с. Войнеговци</p>
          <p className="location-address">район Нови Искър село Войнеговци, 1223 София</p>

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
              📍 Достъп с автомобил
              <br />До локацията може да се стигне по два маршрута – през с. Локорско и през с. Войнеговци.
              Препоръчваме маршрута през с. Локорско.
            </p>

            <p>
              🚕 Достъп с такси<br />
              Локацията се обслужва от таксиметровите компании в София.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: RSVP */}
      <section className="rsvp-section" id="rsvp">
        <div className="container rsvp-container">
          <div className="rsvp-box">
            <h2 className="section-title">Потвърждение</h2>
            <p className="rsvp-deadline">Молим да потвърдите вашето присъствие до 21.06.2026 г.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="elegant-form">
                <div className="guests-loop-container">
                  {formData.guests.map((guest, index) => (
                    <div key={index} className="guest-row-card">
                      <div className="guest-row-header">
                        <h4>{index === 0 ? "Вашите данни" : `Придружаващ гост №${index}`}</h4>
                        {index > 0 && (
                          <button type="button" className="remove-guest-btn" onClick={() => removeGuestRow(index)}>
                            Премахни
                          </button>
                        )}
                      </div>

                      <div className="guest-fields-stack">
                        <div className="form-field-row">
                          <input
                            type="text"
                            placeholder="Име и фамилия"
                            required
                            value={guest.name}
                            onChange={e => handleGuestChange(index, 'name', e.target.value)}
                          />
                        </div>

                        <div className="form-field-row">
                          <select
                            required
                            value={guest.status}
                            onChange={e => handleGuestChange(index, 'status', e.target.value)}
                          >
                            <option value="">Ще присъствате ли?</option>
                            <option value="yes">С удоволствие!</option>
                            <option value="no">Няма да успея</option>
                          </select>
                        </div>

                        {guest.status === 'yes' && (
                          <motion.div 
                            className="form-field-row"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <select
                              value={guest.menu}
                              onChange={e => handleGuestChange(index, 'menu', e.target.value)}
                            >
                              <option value="meat">Класическо меню</option>
                              <option value="veggie">Вегетарианско меню</option>
                              <option value="kids">Детско меню</option>
                            </select>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="add-guest-action-btn" onClick={addGuestRow}>
                  + ДОБАВЕТЕ ПРИДРУЖАВАЩ ГОСТ (партньор / дете)
                </button>

                <textarea
                  placeholder="Бележки, важни детайли или алергии..."
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />

                {submitError && (
                  <motion.div
                    className="error-message-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>Възникна технически проблем. Моля, опитайте отново или се свържете с нас директно!</p>
                  </motion.div>
                )}

                <button type="submit" className="gold-btn">ИЗПРАТИ ПОТВЪРЖДЕНИЕ</button>
              </form>
            ) : (() => {
              const attendingCount = formData.guests.filter(g => g.status === 'yes').length;
              const totalGuests = formData.guests.length;
              const isAllYes = attendingCount === totalGuests && totalGuests > 0;

              return (
                <motion.div
                  className="success-message-wrapper"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {isAllYes && <ConfettiEffect />}
                  <h3>Благодарим ви!</h3>
                  {attendingCount === 1 && (
                    <p className="welcome-message-text">Ще те очакваме на нашата сватба!</p>
                  )}
                  {attendingCount > 1 && (
                    <p className="welcome-message-text">Ще ви очакваме на нашата сватба!</p>
                  )}
                  {attendingCount === 0 && (
                    <p className="welcome-message-text neutral">Вашият отговор беше записан.</p>
                  )}
                </motion.div>
              );
            })()}
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