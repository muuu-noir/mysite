(function () {
            const API_URL = 'https://api.foriio.com/api/v1/developer/works';
            const TOKEN = '0bc34c887226302865633e9f74a83e36';
            const FORIIO_PROFILE = 'https://fori.io/momoko-tz0402';

            let allWorks = [];
            let activeFilter = 'all';

            async function fetchWorks() {
                try {
                    const res = await fetch(API_URL, {
                        headers: {
                            'token': TOKEN,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await res.json();
                    allWorks = data.works || [];
                    buildFilters();
                    renderWorks();
                } catch (e) {
                    document.getElementById('foriio-loading').textContent = 'Failed to load works.';
                }
            }

            function buildFilters() {
                const cats = new Set();
                allWorks.forEach(w => (w.category_list || []).forEach(c => cats.add(c)));
                const filterEl = document.getElementById('foriio-filter');
                Array.from(cats).sort().forEach(cat => {
                    const btn = document.createElement('button');
                    btn.className = 'foriio-filter__btn';
                    btn.dataset.filter = cat;
                    btn.textContent = cat;
                    filterEl.appendChild(btn);
                });

                filterEl.addEventListener('click', (e) => {
                    const btn = e.target.closest('.foriio-filter__btn');
                    if (!btn) return;
                    filterEl.querySelectorAll('.foriio-filter__btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeFilter = btn.dataset.filter;
                    renderWorks();
                });
            }

            function renderWorks() {
                const grid = document.getElementById('foriio-grid');
                const loading = document.getElementById('foriio-loading');
                const countEl = document.getElementById('foriio-count');
                loading.style.display = 'none';

                const filtered = activeFilter === 'all'
                    ? allWorks
                    : allWorks.filter(w => (w.category_list || []).includes(activeFilter));

                countEl.textContent = filtered.length + ' works';

                grid.innerHTML = filtered.map(w => `
                    <div class="foriio-card" data-id="${w.id}">
                        <img class="foriio-card__img" src="${w.thumbnail}" alt="${escapeHtml(w.title)}" loading="lazy">
                        <div class="foriio-card__body">
                            <div class="foriio-card__title">${escapeHtml(w.title)}</div>
                            <div class="foriio-card__cats">
                                ${(w.category_list || []).map(c => `<span class="foriio-card__cat">${escapeHtml(c)}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');

                // Card click -> lightbox
                grid.querySelectorAll('.foriio-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const id = parseInt(card.dataset.id);
                        const work = allWorks.find(w => w.id === id);
                        if (work) openLightbox(work);
                    });
                });
            }

            function openLightbox(work) {
                const lightbox = document.getElementById('foriio-lightbox');
                const inner = document.getElementById('lightbox-inner');

                const images = (work.images || []).map(img => {
                    const src = img.urls?.detail || img.urls?.list || work.thumbnail;
                    return `<img src="${src}" alt="${escapeHtml(work.title)}" loading="lazy">`;
                }).join('');

                inner.innerHTML = `
                    <h3 class="foriio-lightbox__title">${escapeHtml(work.title)}</h3>
                    <div class="foriio-lightbox__meta">
                        ${(work.category_list || []).map(c => `<span class="foriio-card__cat">${escapeHtml(c)}</span>`).join('')}
                    </div>
                    <div class="foriio-lightbox__images">${images}</div>
                    ${work.description ? `<div class="foriio-lightbox__desc">${escapeHtml(work.description)}</div>` : ''}
                    <a href="${FORIIO_PROFILE}" target="_blank" rel="noopener" class="foriio-lightbox__link">
                        View on foriio <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                `;

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeLightbox() {
                document.getElementById('foriio-lightbox').classList.remove('active');
                document.body.style.overflow = '';
            }

            document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
            document.getElementById('foriio-lightbox').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) closeLightbox();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeLightbox();
            });

            function escapeHtml(str) {
                if (!str) return '';
                const d = document.createElement('div');
                d.textContent = str;
                return d.innerHTML;
            }

            fetchWorks();
        })();
