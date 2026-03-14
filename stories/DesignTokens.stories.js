import { html } from "lit";

export default {
  title: "Design Tokens",
  tags: ["autodocs"],
};

export const ColorPalette = {
  render: () => html`
    <div style="padding: 2rem;">
      <h2 style="margin-bottom: 1.5rem;">Color Palette</h2>

      <h3 style="margin-bottom: 1rem;">Primary Colors</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        ${[
          { name: "--color-primary", label: "Primary" },
          { name: "--color-secondary", label: "Secondary" },
          { name: "--color-accent", label: "Accent" },
        ].map(
          (c) => html`
            <div style="text-align: center;">
              <div
                style="width: 80px; height: 80px; border-radius: 12px; background: var(${c.name}); border: 1px solid rgba(128,128,128,0.2);"
              ></div>
              <div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: 600;">${c.label}</div>
              <code style="font-size: 0.75rem; opacity: 0.7;">${c.name}</code>
            </div>
          `
        )}
      </div>

      <h3 style="margin-bottom: 1rem;">Background & Surface</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        ${[
          { name: "--bg-primary", label: "BG Primary" },
          { name: "--bg-secondary", label: "BG Secondary" },
          { name: "--glass-bg", label: "Glass BG" },
        ].map(
          (c) => html`
            <div style="text-align: center;">
              <div
                style="width: 80px; height: 80px; border-radius: 12px; background: var(${c.name}); border: 1px solid rgba(128,128,128,0.2);"
              ></div>
              <div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: 600;">${c.label}</div>
              <code style="font-size: 0.75rem; opacity: 0.7;">${c.name}</code>
            </div>
          `
        )}
      </div>

      <h3 style="margin-bottom: 1rem;">Text Colors</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        ${[
          { name: "--text-primary", label: "Text Primary" },
          { name: "--text-secondary", label: "Text Secondary" },
          { name: "--text-muted", label: "Text Muted" },
        ].map(
          (c) => html`
            <div style="text-align: center;">
              <div
                style="width: 80px; height: 80px; border-radius: 12px; background: var(${c.name}); border: 1px solid rgba(128,128,128,0.2);"
              ></div>
              <div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: 600;">${c.label}</div>
              <code style="font-size: 0.75rem; opacity: 0.7;">${c.name}</code>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const Gradients = {
  render: () => html`
    <div style="padding: 2rem;">
      <h2 style="margin-bottom: 1.5rem;">Gradients</h2>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${[
          { name: "--gradient-primary", label: "Primary Gradient" },
          { name: "--gradient-accent", label: "Accent Gradient" },
          { name: "--gradient-border", label: "Border Gradient (glass-card)" },
        ].map(
          (g) => html`
            <div>
              <div
                style="height: 60px; border-radius: 12px; background: var(${g.name}); border: 1px solid rgba(128,128,128,0.1);"
              ></div>
              <div style="margin-top: 0.5rem;">
                <span style="font-weight: 600;">${g.label}</span>
                <code style="margin-left: 0.5rem; font-size: 0.8rem; opacity: 0.7;">${g.name}</code>
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const Typography = {
  render: () => html`
    <div style="padding: 2rem;">
      <h2 style="margin-bottom: 1.5rem;">Typography</h2>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">h1</code>
          <h1>見出し1 / Heading 1</h1>
        </div>
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">h2</code>
          <h2>見出し2 / Heading 2</h2>
        </div>
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">h3</code>
          <h3>見出し3 / Heading 3</h3>
        </div>
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">p</code>
          <p>
            本文テキストです。Inter と Noto Sans JP を使用しています。
            This is body text using Inter and Noto Sans JP font families.
          </p>
        </div>
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">.sub-title</code>
          <p class="sub-title">サブタイトル / Subtitle text</p>
        </div>
        <div>
          <code style="font-size: 0.8rem; opacity: 0.6;">small</code>
          <p><small>小さなテキスト / Small text for captions and notes</small></p>
        </div>
      </div>
    </div>
  `,
};

export const Spacing = {
  render: () => html`
    <div style="padding: 2rem;">
      <h2 style="margin-bottom: 1.5rem;">Spacing Scale</h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${["0.25rem", "0.5rem", "1rem", "1.5rem", "2rem", "3rem", "4rem"].map(
          (size) => html`
            <div style="display: flex; align-items: center; gap: 1rem;">
              <code style="width: 80px; font-size: 0.8rem;">${size}</code>
              <div
                style="height: 16px; width: ${size}; background: var(--color-primary, #6366f1); border-radius: 4px;"
              ></div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};
