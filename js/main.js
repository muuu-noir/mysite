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
  // Observe existing elements
  revealElements.forEach(el => {
    revealObserver.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('active');
      revealObserver.unobserve(el);
    }
  });
  // 2. Interactive Hero Parallax & Aura
  const hero = document.querySelector('.hero');
  const aura = document.querySelector('.hero-aura');
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg img');

  if (hero && aura) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move aura
      aura.style.left = `${x}px`;
      aura.style.top = `${y}px`;

      // Subtle parallax for background only (Text remains static)
      const moveX = (x - rect.width / 2) / 40;
      const moveY = (y - rect.height / 2) / 40;

      if (heroBg) {
        heroBg.style.transform = `scale(1.1) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
      }
    });

    // Reset position on mouse leave
    hero.addEventListener('mouseleave', () => {
      if (heroBg) heroBg.style.transform = `scale(1) translate(0, 0)`;
    });
  }



  // 2. Hybrid News Fetching (Google Sheets + news.html)
  const newsArea = document.getElementById('top-info');
  if (newsArea) {
    const parseCSV = (csvText) => {
      const rows = csvText.split(/\r?\n/).filter(row => row.trim());
      if (rows.length <= 1) return []; // Skip header

      const newsItems = [];
      // Form columns: Timestamp (unused), Date, Title, Content, Link
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 4) {
          newsItems.push({
            date: cols[1] || 'Unknown Date',
            text: cols[2] || 'No Title',
            content: cols[3] || '',
            link: cols[4] || ''
          });
        }
      }
      return newsItems;
    };

    const fetchHybridNews = async () => {
      try {
        let combinedNews = [];

        // A. Static fetch from news.html
        try {
          const res = await fetch('news.html');
          if (res.ok) {
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const infoTable = doc.querySelector('#news-data');
            if (infoTable) combinedNews = JSON.parse(infoTable.getAttribute('data'));
          }
        } catch (e) { console.warn('Static news fetch failed', e); }

        // B. Dynamic fetch from Google Sheets (CSV)
        if (window.SITE_CONFIG && window.SITE_CONFIG.newsSheetUrl) {
          try {
            const res = await fetch(window.SITE_CONFIG.newsSheetUrl);
            if (res.ok) {
              const csvText = await res.text();
              const sheetNews = parseCSV(csvText);
              combinedNews = [...sheetNews, ...combinedNews];
            }
          } catch (e) { console.warn('Google Sheets news fetch failed', e); }
        }

        // Sort by date (Assuming YYYY.MM.DD format)
        combinedNews.sort((a, b) => b.date.localeCompare(a.date));

        const top3 = combinedNews.slice(0, 3);
        if (top3.length > 0) {
          top3[0].isNew = true;
          // Format for info-table: simplify content for the small preview card
          const displayData = top3.map(item => ({
            date: item.date,
            text: item.text,
            link: item.link
          }));

          newsArea.innerHTML = `
            <info-table data='${JSON.stringify(displayData).replace(/'/g, "&apos;")}'></info-table>
          `;
        } else {
          newsArea.innerHTML = '<p style="text-align: center; font-style: italic; opacity: 0.7;">No new updates yet.</p>';
        }
      } catch (err) {
        console.error('Hybrid news error:', err);
        newsArea.innerHTML = '<p style="text-align: center;">Unable to load news data.</p>';
      }
    };

    fetchHybridNews();
  }


  // 3. Dynamic Header Shadow
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // 4. Global Lightbox (Premium Image Viewer)
  const createLightbox = () => {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-close"><i class="fa fa-times"></i></div>
      <div class="lightbox-content">
        <img src="" alt="Gallery Image Large">
      </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      setTimeout(() => {
        lightbox.style.display = 'none';
      }, 400);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    return lightbox;
  };

  const lightbox = createLightbox();
  const lightboxImg = lightbox.querySelector('img');

  window.openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    setTimeout(() => {
      lightbox.classList.add('active');
    }, 10);
  };

  // Delegate click for gallery images
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && (e.target.closest('#gallery-grid') || e.target.closest('.gallery-grid'))) {
      window.openLightbox(e.target.src);
    }
  });

  // --- System Diagnostics Helpers ---
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

  window.diagLog = diagLog; // Expose globally for config.js scripts

  // Toggle diagnostic with Shift+D
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'KeyD') {
      const overlay = document.getElementById('diagnostic-overlay');
      if (overlay) overlay.classList.toggle('active');
    }
  });

  const initIntegrations = () => {
    diagLog("Initializing Integrations (Robust Mode)");
    if (!window.SITE_CONFIG) {
      diagLog("ERROR: SITE_CONFIG not found in global scope.", true);
      return;
    }
    const { twitterId, newsTag, counterTag, featuredTweet } = window.SITE_CONFIG;

    // A. Twitter & Instagram Integration (Improved Resilience)
    const twitterSection = document.getElementById('SOCIAL');
    const twitterWrapper = document.getElementById('twitter-timeline-wrapper');
    const fallbackCard = document.getElementById('twitter-fallback');
    const instagramFallback = document.getElementById('instagram-fallback');

    if (twitterSection) {
      twitterSection.style.display = 'block';
      diagLog("SOCIAL section detected.");

      // 1. Fill Twitter Fallback
      if (fallbackCard && featuredTweet) {
        const textElem = document.getElementById('fallback-tweet-text');
        const dateElem = document.getElementById('fallback-tweet-date');
        if (textElem) textElem.textContent = featuredTweet.text;
        if (dateElem) dateElem.textContent = featuredTweet.date;
        diagLog("Twitter Native Fallback ready.");
      }

      // 2. Fill Instagram Fallback
      if (instagramFallback) {
        const handleElem = document.getElementById('instagram-handle-text');
        const linkElem = document.getElementById('instagram-profile-link');
        if (handleElem && SITE_CONFIG.instagramId) handleElem.textContent = `@${SITE_CONFIG.instagramId}`;
        if (linkElem && SITE_CONFIG.instagramLink) linkElem.href = SITE_CONFIG.instagramLink;
        diagLog("Instagram card ready.");
      }

      // 3. Try official Twitter widget
      const tryTwitter = () => {
        if (window.twttr && window.twttr.ready && twitterWrapper) {
          diagLog("Twitter widgets.js detected. Attempting render...");
          window.twttr.ready((t) => {
            t.widgets.createTimeline(
              { sourceType: 'profile', screenName: twitterId },
              twitterWrapper,
              { height: 600, theme: 'light', chrome: 'noheader,nofooter,noborders,transparent,noscrollbar' }
            ).then((el) => {
              if (el) {
                diagLog("SUCCESS: Official Timeline rendered.");
                if (fallbackCard) fallbackCard.style.display = 'none';
              } else {
                diagLog("WARNING: Timeline create returned null (429 / Blocked)", true);
              }
            }).catch(err => diagLog(`ERROR: Widget fail: ${err.message}`, true));
          });
        }
      };

      setTimeout(tryTwitter, 3500);
      setTimeout(() => {
        twitterSection.querySelectorAll('.reveal').forEach(r => r.classList.add('active'));
      }, 1500);
    }

    // C. Access Counter Integration
    const counterContainer = document.getElementById('access-counter');
    if (counterContainer && counterTag && !counterTag.includes('お嬢様、ここに')) {
      diagLog("Injecting Counter Tag.");
      counterContainer.innerHTML = counterTag;
    }
  };

  // Run integrations immediately
  initIntegrations();
});
