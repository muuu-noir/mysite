/**
 * 396 FOLIO - Main Logic
 */

// 1. Reveal Elements Observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -50px', threshold: 0.01 });

document.addEventListener('DOMContentLoaded', () => {
  // --- A. System Log (Console Only) ---
  const diagLog = (msg, isError = false) => {
    if (isError) console.warn(`[396 FOLIO] ${msg}`); else console.log(`[396 FOLIO] ${msg}`);
  };
  window.diagLog = diagLog;
  diagLog("System: Online.");

  // --- B. Hybrid News Engine ---
  const initNews = async () => {
    const newsArea = document.getElementById('top-info') || document.getElementById('news-area');
    if (!newsArea) return diagLog("News: Container not found on this page.");

    diagLog("News Area detected. Starting hybrid fetch...");

    // DEBUG: Check Config Content
    const configKeys = Object.keys(window.SITE_CONFIG || {});
    diagLog(`Debug info: window.SITE_CONFIG keys = [${configKeys.join(', ')}]`);

    const parseCSV = (csv) => {
      diagLog(`Parsing CSV: ${csv.length} bytes`);
      const splitLine = (l) => {
        const res = []; let s = 0, q = false;
        for (let i = 0; i < l.length; i++) {
          if (l[i] === '"') q = !q;
          if (l[i] === ',' && !q) { res.push(l.substring(s, i).replace(/^"|"$/g, '').trim()); s = i + 1; }
        }
        res.push(l.substring(s).replace(/^"|"$/g, '').trim());
        return res;
      };
      const rows = csv.split(/\r?\n/).filter(r => r.trim());
      if (rows.length <= 1) return [];
      const items = [];
      for (let i = 1; i < rows.length; i++) {
        const c = splitLine(rows[i]);
        if (c.length >= 4) {
          const title = c[2] || '';
          const content = c[3] || '';
          const fullText = (title && content) ? `${title} ${content}` : (title || content);
          items.push({ date: (c[1] || '').replace(/\//g, '.'), text: fullText, link: c[4] || '' });
        }
      }
      return items;
    };

    try {
      let combined = [];
      // 1. news.html
      try {
        diagLog("Fetching news.html archive...");
        const res = await fetch('news.html');
        if (res.ok) {
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const node = doc.querySelector('#news-data');
          if (node) {
            const data = JSON.parse(node.getAttribute('data'));
            combined = data;
            diagLog(`Loaded ${data.length} archived items.`);
          }
        }
      } catch (e) { diagLog("Static archive offline.", true); }

      // 2. Google Sheet
      const sheetUrl = window.SITE_CONFIG ? window.SITE_CONFIG.newsSheetUrl : null;
      if (sheetUrl) {
        diagLog(`Fetching Google Sheet: ${sheetUrl.substring(0, 30)}...`);
        try {
          const res = await fetch(sheetUrl);
          if (res.ok) {
            const csv = await res.text();
            const sheetItems = parseCSV(csv);
            combined = [...sheetItems, ...combined];
            diagLog(`Merged ${sheetItems.length} fresh items from Sheet.`);
          } else {
            diagLog(`Sheet error: HTTP ${res.status}`, true);
          }
        } catch (e) {
          diagLog(`Sheet fetch failed: ${e.message}`, true);
          if (window.location.protocol === 'file:') diagLog("Browser blocks external fetch via file:// protocol.", true);
        }
      } else {
        diagLog("No newsSheetUrl configured in config.js.", true);
      }

      // Sort & Render
      combined.sort((a, b) => b.date.localeCompare(a.date));
      const display = combined.slice(0, newsArea.id === 'top-info' ? 3 : 20); // Top page shows 3, News page shows up to 20

      if (display.length > 0) {
        display[0].isNew = true; // Force mark newest as NEW
        diagLog(`Rendering ${display.length} items to ${newsArea.id}...`);
        newsArea.innerHTML = `<info-table data='${JSON.stringify(display).replace(/'/g, "&apos;")}'></info-table>`;
      } else {
        newsArea.innerHTML = '<p class="flex-center">No news yet.</p>';
        diagLog("No items found to render.");
      }
    } catch (err) {
      diagLog(`Critical Engine Failure: ${err.message}`, true);
    }
  };

  initNews();

  // --- C. Hero & Visuals ---
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  const hero = document.querySelector('.hero'), aura = document.querySelector('.hero-aura'), heroBg = document.querySelector('.hero-bg img');
  if (hero && aura) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      aura.style.left = `${x}px`; aura.style.top = `${y}px`;
      if (heroBg) {
        const mx = (x - r.width / 2) / 40, my = (y - r.height / 2) / 40;
        heroBg.style.transform = `scale(1.1) translate(${mx * 0.5}px, ${my * 0.5}px)`;
      }
    });
    hero.addEventListener('mouseleave', () => { if (heroBg) heroBg.style.transform = `scale(1) translate(0, 0)`; });
  }

  // --- D. Global Tools (Lightbox, etc.) ---
  const header = document.querySelector('header');
  if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const createLightbox = () => {
    const lb = document.createElement('div');
    lb.className = 'lightbox-overlay'; lb.id = 'lightbox';
    lb.innerHTML = '<div class="lightbox-close"><i class="fa fa-times"></i></div><div class="lightbox-content"><img src=""></div>';
    document.body.appendChild(lb);
    const close = () => { lb.classList.remove('active'); setTimeout(() => lb.style.display = 'none', 400); };
    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    return lb;
  };
  const lightbox = createLightbox();
  window.openLightbox = (src) => {
    const img = lightbox.querySelector('img'); img.src = src;
    lightbox.style.display = 'flex'; setTimeout(() => lightbox.classList.add('active'), 10);
  };
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && (e.target.closest('#gallery-grid') || e.target.closest('.gallery-grid'))) window.openLightbox(e.target.src);
  });

  // --- E. Integrations ---
  const initIntegrations = () => {
    if (!window.SITE_CONFIG) return;
    const { twitterId, counterTag, featuredTweet } = window.SITE_CONFIG;
    const soc = document.getElementById('SOCIAL');
    if (soc) {
      if (featuredTweet) {
        const ft = document.getElementById('fallback-tweet-text'), fd = document.getElementById('fallback-tweet-date');
        if (ft) ft.textContent = featuredTweet.text; if (fd) fd.textContent = featuredTweet.date;
      }
      setTimeout(() => {
        if (window.twttr && window.twttr.ready) {
          window.twttr.ready((t) => {
            t.widgets.createTimeline({ sourceType: 'profile', screenName: twitterId }, document.getElementById('twitter-timeline-wrapper'), { height: 600, theme: 'light', chrome: 'noheader,nofooter,noborders,transparent' })
              .then((el) => { if (el) { diagLog("Twitter Success."); document.getElementById('twitter-fallback').style.display = 'none'; } });
          });
        }
      }, 3000);
    }
    const cnt = document.getElementById('access-counter');
    if (cnt && counterTag && !counterTag.includes('お嬢様、ここに')) cnt.innerHTML = counterTag;
  };
  initIntegrations();
});
