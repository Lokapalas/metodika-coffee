import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('bg_color');
    }
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        Metodika Coffee
      </header>

      <main style={styles.main}>
        <h2>Главная</h2>
        <p>Выберите напиток и оформите заказ</p>
      </main>

      <footer style={styles.footer}>
        Telegram Mini App
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    padding: '16px',
    fontSize: '20px',
    fontWeight: 600,
  },
  main: {
    flex: 1,
    padding: '16px',
  },
  footer: {
    padding: '12px',
    fontSize: '13px',
    opacity: 0.6,
  },
};
