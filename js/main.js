/**
 * 396 FOLIO - Main Logic
 */

// 1. Sophisticated Staggered Reveal Animations (Mobile Optimized)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -50px',
  threshold: 0.01
});
window.revealObserver = revealObserver; // Globally available for components

document.addEventListener('DOMContentLoaded', () => {
  // --- A. System Diagnostics Definition (Must be FIRST) ---
  const diagLog = (msg, isError = false) => {
    const diagContainer = document.getElementById('diag-log');
    if (diagContainer) {
      const item = document.createElement('div');
      item.className = 'diag-item' + (isError ? ' error' : '');
      item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      diagContainer.prepend(item);
    }
    console.log(`[Diagnostic] ${msg}`);
  };
  window.diagLog = diagLog; // Expose globally

  // Toggle overlay with Shift+D
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'KeyD') {
      const overlay = document.getElementById('diagnostic-overlay');
      if (overlay) overlay.classList.toggle('active');
    }
  });

  diagLog("System: DOMContentLoaded fired. Booting logic...");

  // --- B. News Logic (The core of current debug) ---
  const initNews = async () => {
    diagLog("News Unit: Searching for display container...");

    // Attempt multiple selectors to find where the news should go
    let newsArea = document.getElementById('top-info')
      || document.getElementById('news-area')
      || document.querySelector('.news-container-external');

    if (!newsArea) {
      // Fallback: search by section title if IDs fail
      const titles = Array.from(document.querySelectorAll('section-title'));
      const newsTitle = titles.find(t => t.getAttribute('title') === 'NEWS');
      if (newsTitle) {
        newsArea = newsTitle.parentElement.querySelector('glass-card');
      }
    }

    if (!newsArea) {
      diagLog("News Unit: ABORTED. Target container not found.", true);
      return;
    }

    diagLog(`News Unit: Container found [${newsArea.id || 'no-id'}]. Initiating fetch...`);

    const parseCSV = (csvText) => {
      diagLog(`News Unit: Parsing Sheet data (${csvText.length} bytes)...`);
      const splitCsvLine = (line) => {
        const result = [];
        let start = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQuotes = !inQuotes;
          if (line[i] === ',' && !inQuotes) {
            result.push(line.substring(start, i).replace(/^"|"$/g, '').trim());
            start = i + 1;
          }
        }
        result.push(line.substring(start).replace(/^"|"$/g, '').trim());
        return result;
      };

      const rows = csvText.split(/\r?\n/).filter(row => row.trim());
      if (rows.length <= 1) return [];

      const items = [];
      for (let i = 1; i < rows.length; i++) {
        const cols = splitCsvLine(rows[i]);
        if (cols.length >= 4) {
          items.push({
            date: cols[1] || 'Unknown',
            text: cols[2] || 'No Title',
            link: cols[4] || ''
          });
        }
      }
      diagLog(`News Unit: Parsed ${items.length} items.`);
      return items;
    };

    try {
      let combined = [];

      // 1. Static fetch
      try {
        diagLog("News Unit: Fetching static news.html...");
        const res = await fetch('news.html');
        if (res.ok) {
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const dataNode = doc.querySelector('#news-data');
          if (dataNode) combined = JSON.parse(dataNode.getAttribute('data'));
          diagLog(`News Unit: Static fetch OK (${combined.length} items).`);
        }
      } catch (e) { diagLog(`News Unit: Static fetch failed: ${e.message}`, true); }

      // 2. Google Sheets fetch
      if (window.SITE_CONFIG && window.SITE_CONFIG.newsSheetUrl) {
        try {
          diagLog("News Unit: Fetching Google Sheet CSV...");
          const res = await fetch(window.SITE_CONFIG.newsSheetUrl);
          if (res.ok) {
            const csv = await res.text();
            const sheetItems = parseCSV(csv);
            combined = [...sheetItems, ...combined];
          } else {
            diagLog(`News Unit: Sheet fetch error ${res.status}`, true);
          }
        } catch (e) {
          diagLog(`News Unit: Sheet fetch error: ${e.message}`, true);
          if (window.location.protocol === 'file:') diagLog("Local file:// protocol blocks external fetch.", true);
        }
      }

      // 3. Sort and Render
      combined.forEach(item => { if (item.date) item.date = item.date.replace(/\//g, '.'); });
      combined.sort((a, b) => b.date.localeCompare(a.date));

      const top3 = combined.slice(0, 3);
      if (top3.length > 0) {
        top3[0].isNew = true;
        const displayData = top3.map(item => ({
          date: item.date,
          text: item.text,
          link: item.link,
          isNew: item.isNew || false
        }));
        newsArea.innerHTML = `<info-table data='${JSON.stringify(displayData).replace(/'/g, "&apos;")}'></info-table>`;
        diagLog("News Unit: Rendered top 3 items.");
      } else {
        newsArea.innerHTML = '<p class="flex-center">No news entries discovered.</p>';
        diagLog("News Unit: Result list is empty.");
      }
    } catch (err) {
      diagLog(`News Unit: CRITICAL FAIL: ${err.message}`, true);
    }
  };

  // Run News Init
  initNews();

  // --- C. Hero & Visuals ---
  revealElements.forEach(el => { revealObserver.observe(el); });
  const hero = document.querySelector('.hero');
  const aura = document.querySelector('.hero-aura');
  const heroBg = document.querySelector('.hero-bg img');
  if (hero && aura) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      aura.style.left = `${x}px`; aura.style.top = `${y}px`;
      if (heroBg) {
        const moveX = (x - rect.width / 2) / 40, moveY = (y - rect.height / 2) / 40;
        heroBg.style.transform = `scale(1.1) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
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

  // --- E. Integrations (Twitter/Insta/Counter) ---
  const initIntegrations = () => {
    diagLog("Integrations: Booting external scripts...");
    if (!window.SITE_CONFIG) return diagLog("ERROR: config.js missing!", true);

    const { twitterId, counterTag, featuredTweet } = window.SITE_CONFIG;
    const twitterSection = document.getElementById('SOCIAL');
    const twitterWrapper = document.getElementById('twitter-timeline-wrapper');
    const fallbackTweet = document.getElementById('twitter-fallback');

    if (twitterSection) {
      diagLog("Integrations: SOCIAL section active.");
      if (fallbackTweet && featuredTweet) {
        document.getElementById('fallback-tweet-text').textContent = featuredTweet.text;
        document.getElementById('fallback-tweet-date').textContent = featuredTweet.date;
      }
      const tryTwitter = () => {
        if (window.twttr && window.twttr.ready && twitterWrapper) {
          window.twttr.ready((t) => {
            t.widgets.createTimeline({ sourceType: 'profile', screenName: twitterId }, twitterWrapper, { height: 600, theme: 'light', chrome: 'noheader,nofooter,noborders,transparent' })
              .then((el) => { if (el) { diagLog("Integrations: Twitter SUCCESS."); fallbackTweet.style.display = 'none'; } });
          });
        }
      };
      setTimeout(tryTwitter, 3500);
    }
    const cnt = document.getElementById('access-counter');
    if (cnt && counterTag && !counterTag.includes('お嬢様、ここに')) {
      diagLog("Integrations: Injecting Counter.");
      cnt.innerHTML = counterTag;
    }
  };

  initIntegrations();
});
