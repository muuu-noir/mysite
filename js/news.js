document.addEventListener('DOMContentLoaded', () => {
            const INITIAL_COUNT = 3;

            fetch('blog/index.json')
                .then(res => res.json())
                .then(articles => {
                    const container = document.getElementById('blog-list');
                    if (!articles.length) {
                        container.innerHTML = '<p class="flex-center text-italic text-sub">記事はまだありません。</p>';
                        return;
                    }

                    function renderItem(a) {
                        return `<a href="${a.url}" class="blog-list-item">
                            <div class="blog-list-item-meta">
                                <time>${a.dateFormatted}</time>
                                <span class="article-category">${a.category}</span>
                            </div>
                            <div class="blog-list-item-title">${a.title}</div>
                            ${a.description ? `<div class="blog-list-item-desc">${a.description}</div>` : ''}
                        </a>`;
                    }

                    const initialItems = articles.slice(0, INITIAL_COUNT);
                    const remainingItems = articles.slice(INITIAL_COUNT);

                    container.innerHTML = initialItems.map(renderItem).join('');

                    if (remainingItems.length > 0) {
                        const loadMoreWrap = document.createElement('div');
                        loadMoreWrap.className = 'flex-center load-more-wrap';
                        loadMoreWrap.innerHTML = '<button class="btn-cta" id="blog-load-more">LOAD MORE</button>';
                        container.after(loadMoreWrap);

                        document.getElementById('blog-load-more').addEventListener('click', () => {
                            container.innerHTML += remainingItems.map(renderItem).join('');
                            loadMoreWrap.remove();
                        });
                    }
                })
                .catch(() => {
                    document.getElementById('blog-list').innerHTML = '<p class="flex-center text-italic text-sub">記事の読み込みに失敗しました。</p>';
                });
        });
