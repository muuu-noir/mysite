import "../css/main.css";
import "../js/components.js";

// Initialize reveal observer (from main.js logic)
if (!window.revealObserver) {
  window.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          window.revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -50px", threshold: 0.01 }
  );
}

// Inject external CDN links into the preview head
const cdnLinks = [
  // destyle reset
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/destyle.css@4.0.1/destyle.min.css">',
  // Font Awesome
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">',
  // Google Fonts
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap">',
];

cdnLinks.forEach((html) => {
  if (!document.head.querySelector(`link[href="${html.match(/href="([^"]+)"/)?.[1]}"]`)) {
    const range = document.createRange();
    range.selectNode(document.head);
    document.head.appendChild(range.createContextualFragment(html));
  }
});

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Theme mode",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || "light";
      document.documentElement.setAttribute("data-theme", theme);
      return story();
    },
  ],
};

export default preview;
