/**
 * 396 FOLIO - Gallery Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    const loader = document.getElementById('gallery-loader');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const loadMoreWrap = document.getElementById('load-more-wrap');
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (!grid) return;

    let allFoundItems = [];
    let currentIndex = 0;
    const itemsPerPage = 4;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Particle System (Heart Shower) ---
    function sparkHearts() {
        const colors = ['#ED4956', '#FF6B6B', '#FF8787', '#FFA8A8'];
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.innerHTML = '<i class="fa-solid fa-heart"></i>';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-50px';
            p.style.color = colors[Math.floor(Math.random() * colors.length)];
            p.style.opacity = Math.random();
            p.style.animationDuration = (Math.random() * 2 + 1) + 's';
            p.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 3000);
        }
    }

    // --- Butler's Feedback Bubble ---
    let feedbackTimeout;
    function showButlerMessage(msg) {
        let bubble = document.getElementById('butler-feedback');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.id = 'butler-feedback';
            bubble.className = 'feedback-bubble';
            bubble.innerHTML = `
                <img src="img/profile/profile_avatar.png" class="feedback-avatar" alt="Butler">
                <div class="feedback-text">
                    <b>396 FOLIO</b>
                    <span id="butler-msg-text"></span>
                </div>
            `;
            document.body.appendChild(bubble);
        }
        document.getElementById('butler-msg-text').textContent = msg;
        bubble.classList.add('active');
        clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => bubble.classList.remove('active'), 4000);
    }

    // --- Analytics Tracker ---
    function trackGalleryEvent(action, itemLabel) {
        if (typeof gtag === 'function') {
            gtag('event', 'gallery_interaction', {
                'interaction_type': action,
                'item_id': itemLabel
            });
        }
    }

    // --- Flexible Item Creator (lazy image loading) ---
    function createItem(prefix, imagePaths, title, description, medium) {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';

        const itemId = imagePaths.map(p => p.split('/').pop().split('.')[0]).join('_');
        const altText = title || `${prefix} artwork`;
        const imagesHtml = imagePaths.map(src => `<img data-src="${src}" alt="${altText}" loading="lazy">`).join('');
        const hasMultiple = imagePaths.length > 1;

        item.innerHTML = `
            <div class="post-header">
                <img src="img/profile/profile_avatar.png" class="post-avatar" alt="Avatar">
                <span class="post-username">396 FOLIO</span>
            </div>
            <div class="post-image-wrap">
                ${imagesHtml}
                <div class="big-heart"><i class="fa-solid fa-heart"></i></div>
                ${hasMultiple ? `<div class="post-indicator"><i class="fa fa-clone"></i> 1/${imagePaths.length}</div>` : ''}
                ${hasMultiple ? `<div class="carousel-dots">${imagePaths.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}</div>` : ''}
            </div>
            <div class="post-actions">
                <div class="post-actions-left">
                    <i class="fa-regular fa-heart action-like"></i>
                    <i class="fa-regular fa-comment action-comment"></i>
                    <i class="fa-regular fa-paper-plane action-share"></i>
                </div>
                <i class="fa-regular fa-bookmark action-save"></i>
            </div>
            <div class="post-caption" style="padding-bottom: 1.5rem;">
                ${title ? `<div class="post-caption-title">${title}</div>` : ''}
                ${description ? `<div class="post-caption-desc">${description}</div>` : ''}
                ${medium ? `<div class="post-caption-medium">${medium}</div>` : `<span class="username-bold">396 FOLIO</span> ${prefix} collection`}
            </div>
        `;

        const wrap = item.querySelector('.post-image-wrap');
        const bigHeart = item.querySelector('.big-heart');
        const likeBtn = item.querySelector('.action-like');

        // Double Tap to Like
        let lastTap = 0;
        wrap.addEventListener('click', () => {
            const now = Date.now();
            const timesince = now - lastTap;
            if (timesince < 300 && timesince > 0) {
                if (!likeBtn.classList.contains('active')) {
                    likeBtn.classList.add('active');
                    likeBtn.classList.replace('fa-regular', 'fa-solid');
                    sparkHearts();
                    showButlerMessage("ゲスト様、素敵なリアクションをありがとうございます！");
                    trackGalleryEvent('double_tap_like', itemId);
                }
                bigHeart.classList.add('active');
                setTimeout(() => bigHeart.classList.remove('active'), 1000);
            } else {
                if (hasMultiple) {
                    const width = wrap.offsetWidth;
                    const next = wrap.scrollLeft + 10 >= (imagePaths.length - 1) * width ? 0 : wrap.scrollLeft + width;
                    wrap.scrollTo({ left: next, behavior: 'smooth' });
                }
            }
            lastTap = now;
        });

        // Long Press Secret
        let pressTimer;
        wrap.addEventListener('mousedown', () => { pressTimer = setTimeout(() => showButlerMessage("秘蔵のデッサンも、いつか公開されるかもしれません..."), 1200); });
        wrap.addEventListener('mouseup', () => { clearTimeout(pressTimer); });
        wrap.addEventListener('touchstart', () => { pressTimer = setTimeout(() => showButlerMessage("この作品には特別な想いが込められているようです。"), 1200); }, { passive: true });
        wrap.addEventListener('touchend', () => { clearTimeout(pressTimer); });

        // Button Actions
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('active');
            if (likeBtn.classList.contains('active')) {
                likeBtn.classList.replace('fa-regular', 'fa-solid');
                sparkHearts();
                showButlerMessage("お気に召していただけて、光栄です。");
                trackGalleryEvent('button_like', itemId);
            } else {
                likeBtn.classList.replace('fa-solid', 'fa-regular');
                trackGalleryEvent('unlike', itemId);
            }
        });

        item.querySelector('.action-comment').addEventListener('click', () => {
            showButlerMessage("今は心の中で語りかけてみてください。そっと伝えておきます。");
            trackGalleryEvent('comment_click', itemId);
        });

        item.querySelector('.action-share').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showButlerMessage("この作品を、ぜひ多くの方へ。リンクをコピーしました。");
                trackGalleryEvent('share', itemId);
            });
        });

        const saveBtn = item.querySelector('.action-save');
        saveBtn.addEventListener('click', () => {
            saveBtn.classList.toggle('active');
            if (saveBtn.classList.contains('active')) {
                saveBtn.classList.replace('fa-regular', 'fa-solid');
                showButlerMessage("栞を挟んでおきます。またいつでもこの作品に会いに来てください。");
                trackGalleryEvent('save', itemId);
            } else {
                saveBtn.classList.replace('fa-solid', 'fa-regular');
            }
        });

        if (hasMultiple) {
            wrap.addEventListener('scroll', () => {
                const index = Math.round(wrap.scrollLeft / wrap.offsetWidth);
                const indicator = item.querySelector('.post-indicator');
                const dots = item.querySelectorAll('.dot');
                if (indicator) indicator.innerHTML = `<i class="fa fa-clone"></i> ${index + 1}/${imagePaths.length}`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            }, { passive: true });
        }
        return item;
    }

    // --- Lazy image loader via IntersectionObserver ---
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    function renderNextBatch() {
        const limit = Math.min(currentIndex + itemsPerPage, allFoundItems.length);
        const batch = allFoundItems.slice(currentIndex, limit);

        batch.forEach((item, i) => {
            grid.appendChild(item);
            // Observe lazy images
            item.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
            setTimeout(() => {
                if (window.revealObserver) window.revealObserver.observe(item);
                else item.classList.add('active');
            }, i * 30);
        });

        currentIndex = limit;
        loadMoreWrap.style.display = currentIndex >= allFoundItems.length ? 'none' : 'flex';
    }

    // --- Gallery Data ---
    // p({ id, title, desc }) — 追加時はこの3つだけでOK
    // 必要な時だけ med / e1 / e2 を上書き
    const DEFAULTS = { med: '鉛筆 / ケント紙', e1: 'webp', e2: 'JPG' };
    const p = ({ id, title, desc, med = DEFAULTS.med, e1 = DEFAULTS.e1, e2 = DEFAULTS.e2 }) => ({
        prefix: 'pencil',
        paths: [`img/gallery/pencil_${id}_1.${e1}`, `img/gallery/pencil_${id}_2.${e2}`],
        title, description: desc, medium: med
    });

    const initialPosts = [
        p({ id: 1,  title: 'Case 001', desc: 'Neither is a lie. Both are me.', e1: 'jpg' }),
        p({ id: 2,  title: 'Case 003', desc: 'The brighter the light the darker the shadow.', e1: 'jpg' }),
        p({ id: 3,  title: 'Case 007', desc: 'Devouring the last innocence.', e1: 'jpg' }),
        p({ id: 4,  title: 'Case 005', desc: 'He wears the sky like a bruise waiting for the rain to wash away his name.', e1: 'jpg' }),
        p({ id: 5,  title: 'Case 011', desc: 'Wandering through the void, where no one know her name.', e1: 'jpg' }),
        p({ id: 6,  title: 'Case 009', desc: 'Cold arms, warm wings.' }),
        p({ id: 7,  title: 'Case 002', desc: "Style is er armor in a world that's fading to black.", e1: 'jpg' }),
        p({ id: 8,  title: 'Case 015', desc: 'A face without a name, a soul without a cage.', e1: 'jpg' }),
        p({ id: 9,  title: 'Case 014', desc: 'Even the light is a poison here.', med: '水彩 / 水彩紙' }),
        p({ id: 10, title: 'Case 004', desc: 'Page 404: Person not found.' }),
        p({ id: 11, title: 'Case 012', desc: 'Watching the stars burn out, one by one.' }),
        p({ id: 12, title: 'Case 013', desc: 'Beauty is a parasite.', med: '水彩 / 水彩紙' }),
        p({ id: 13, title: 'Case 008', desc: 'The circus is empty, but the paint never washes off.', med: '水彩 / 水彩紙', e2: 'webp' }),
        p({ id: 14, title: 'Case 010', desc: 'Silence is the loudest song she knows.' }),
    ];

    function initGallery() {
        allFoundItems = initialPosts.map(post => createItem(post.prefix, post.paths, post.title, post.description, post.medium));
        allFoundItems = shuffle(allFoundItems);
        loader.style.display = 'none';
        grid.style.display = 'grid';
        renderNextBatch();
    }

    initGallery();

    // Event Listeners
    loadMoreBtn.addEventListener('click', renderNextBatch);
    shuffleBtn.addEventListener('click', () => {
        grid.innerHTML = '';
        currentIndex = 0;
        allFoundItems = shuffle(allFoundItems);
        renderNextBatch();
    });
});
