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
        for (let i = 0; i < 20; i++) {
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

    // --- Toast Utility ---
    function showToast(message) {
        let toast = document.getElementById('gallery-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gallery-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2500);
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

    // --- Flexible Item Creator ---
    function createItem(prefix, imagePaths) {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';

        const itemId = imagePaths.map(p => p.split('/').pop().split('.')[0]).join('_');
        const imagesHtml = imagePaths.map(src => `<img src="${src}" alt="${prefix} image" loading="lazy">`).join('');
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
                <span class="username-bold">396 FOLIO</span> ${prefix} collection
            </div>
        `;

        const wrap = item.querySelector('.post-image-wrap');
        const bigHeart = item.querySelector('.big-heart');
        const likeBtn = item.querySelector('.action-like');

        // Double Tap to Like
        let lastTap = 0;
        wrap.addEventListener('click', (e) => {
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
        wrap.addEventListener('mousedown', () => { pressTimer = window.setTimeout(() => showButlerMessage("秘蔵のデッサンも、いつか公開されるかもしれません..."), 1200); });
        wrap.addEventListener('mouseup', () => { clearTimeout(pressTimer); });
        wrap.addEventListener('touchstart', () => { pressTimer = window.setTimeout(() => showButlerMessage("この作品には特別な想いが込められているようです。"), 1200); });
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
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
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

    function renderNextBatch() {
        const limit = Math.min(currentIndex + itemsPerPage, allFoundItems.length);
        const batch = allFoundItems.slice(currentIndex, limit);

        batch.forEach((item, i) => {
            grid.appendChild(item);
            setTimeout(() => {
                if (window.revealObserver) window.revealObserver.observe(item);
                else item.classList.add('active');
            }, i * 30);
        });

        currentIndex = limit;
        if (currentIndex >= allFoundItems.length) {
            loadMoreWrap.style.display = 'none';
        } else {
            loadMoreWrap.style.display = 'flex';
        }
    }

    // --- Known Assets (Instant Load) ---
    const initialPosts = [
        { prefix: 'pencil', paths: ['img/gallery/pencil_1_1.PNG', 'img/gallery/pencil_1_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_2_1.PNG', 'img/gallery/pencil_2_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_3_1.PNG', 'img/gallery/pencil_3_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_4_1.PNG', 'img/gallery/pencil_4_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_5_1.PNG', 'img/gallery/pencil_5_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_6_1.webp', 'img/gallery/pencil_6_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_7_1.PNG', 'img/gallery/pencil_7_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_8_1.PNG', 'img/gallery/pencil_8_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_9_1.webp', 'img/gallery/pencil_9_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_10_1.webp', 'img/gallery/pencil_10_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_11_1.webp', 'img/gallery/pencil_11_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_12_1.webp', 'img/gallery/pencil_12_2.JPG'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_13_1.webp', 'img/gallery/pencil_13_2.webp'] },
        { prefix: 'pencil', paths: ['img/gallery/pencil_14_1.webp', 'img/gallery/pencil_14_1.JPG'] }
    ];

    const supportedExts = ['webp', 'jpg', 'png', 'jpeg', 'JPG', 'PNG'];

    async function checkImg(src) {
        return new Promise(r => {
            const img = new Image();
            img.onload = () => r(true);
            img.onerror = () => r(false);
            img.src = src;
        });
    }

    async function findImage(basePath) {
        for (const ext of supportedExts) {
            const src = `${basePath}.${ext}`;
            if (await checkImg(src)) return src;
        }
        return null;
    }

    function initGallery() {
        allFoundItems = initialPosts.map(p => createItem(p.prefix, p.paths));
        allFoundItems = shuffle(allFoundItems);
        loader.style.display = 'none';
        grid.style.display = 'grid';
        renderNextBatch();
    }

    async function backgroundDiscovery() {
        const prefixes = ['pencil', 'watercolor', 'digital', 'work'];
        for (const prefix of prefixes) {
            let startId = 15;
            if (prefix === 'digital') startId = 34;
            if (prefix === 'watercolor') startId = 12;

            for (let i = startId; i < startId + 3; i++) {
                const multi1 = await findImage(`img/gallery/${prefix}_${i}_1`);
                if (multi1) {
                    const paths = [multi1];
                    for (let j = 2; j <= 5; j++) {
                        const m = await findImage(`img/gallery/${prefix}_${i}_${j}`);
                        if (m) paths.push(m); else break;
                    }
                    allFoundItems.push(createItem(prefix, paths));
                } else {
                    const s = await findImage(`img/gallery/${prefix}_${i}`);
                    if (s) allFoundItems.push(createItem(prefix, [s]));
                }
            }
        }
        if (currentIndex < allFoundItems.length) loadMoreWrap.style.display = 'flex';
    }

    initGallery();
    backgroundDiscovery();

    // Event Listeners
    loadMoreBtn.addEventListener('click', renderNextBatch);
    shuffleBtn.addEventListener('click', () => {
        grid.innerHTML = '';
        currentIndex = 0;
        allFoundItems = shuffle(allFoundItems);
        renderNextBatch();
    });
});
