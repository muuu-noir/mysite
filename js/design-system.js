
        document.addEventListener('DOMContentLoaded', () => {
            const toast = document.getElementById('ds-toast');
            const toastMsg = document.getElementById('ds-toast-msg');

            const showToast = (message) => {
                toastMsg.textContent = message;
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            };

            // Color Clipboard Copy
            const colorCards = document.querySelectorAll('.ds-color-card');
            colorCards.forEach(card => {
                card.addEventListener('click', () => {
                    const valueToCopy = card.getAttribute('data-copy');
                    navigator.clipboard.writeText(valueToCopy)
                        .then(() => {
                            showToast(`Copied CSS Variable: ${valueToCopy}`);
                        })
                        .catch(err => {
                            console.error('Failed to copy', err);
                        });
                });
            });

            // Code Snippet Clipboard Copy
            const copyButtons = document.querySelectorAll('.ds-code-copy-btn');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const codeBlock = btn.nextElementSibling.querySelector('code');
                    // Remove span tags to copy plain text
                    const plainText = codeBlock.textContent;
                    navigator.clipboard.writeText(plainText)
                        .then(() => {
                            showToast('HTML Code Snippet copied!');
                            btn.textContent = 'COPIED!';
                            setTimeout(() => {
                                btn.textContent = 'COPY';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy code snippet', err);
                        });
                });
            });

            // Replay Reveal Animation
            const replayBtn = document.getElementById('replay-reveal');
            if (replayBtn) {
                replayBtn.addEventListener('click', () => {
                    const reveals = document.querySelectorAll('.reveal');
                    reveals.forEach(el => {
                        el.classList.remove('active');
                        // Trigger reflow
                        void el.offsetWidth;
                        el.classList.add('active');
                    });
                    showToast('Revealed animations replayed!');
                });
            }

            // Quick Nav Active State on scroll
            const sections = document.querySelectorAll('.ds-section');
            const navLinks = document.querySelectorAll('.ds-nav a');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= (sectionTop - 250)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === current) {
                        link.classList.add('active');
                    }
                });
            }, { passive: true });
        });
    