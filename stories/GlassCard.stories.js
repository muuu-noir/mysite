import { html } from "lit";

export default {
  title: "Components/GlassCard",
  tags: ["autodocs"],
  argTypes: {
    reveal: {
      control: "boolean",
      description: "スクロールアニメーションを有効にするか",
    },
    grid: {
      control: "boolean",
      description: "グリッドレイアウトを有効にするか",
    },
    center: {
      control: "boolean",
      description: "中央揃えにするか",
    },
    content: {
      control: "text",
      description: "カード内のコンテンツ（HTML可）",
    },
  },
  args: {
    reveal: false,
    grid: false,
    center: false,
    content: "<h3>Glass Card</h3><p>すりガラス風のカードコンポーネントです。背景のぼかしとグラデーションボーダーが特徴です。</p>",
  },
};


export const Default = {
  render: () => html`
    <glass-card>
      <h3>Glass Card</h3>
      <p>すりガラス風のカードコンポーネントです。背景のぼかしとグラデーションボーダーが特徴です。</p>
    </glass-card>
  `,
};

export const Centered = {
  render: () => html`
    <glass-card center>
      <h3>Centered Card</h3>
      <p>中央揃えのカードです。</p>
    </glass-card>
  `,
};

export const GridLayout = {
  render: () => html`
    <glass-card grid>
      <div>
        <h3>左カラム</h3>
        <p>グリッドレイアウトの左側です。</p>
      </div>
      <div>
        <h3>右カラム</h3>
        <p>グリッドレイアウトの右側です。</p>
      </div>
    </glass-card>
  `,
};

export const WithReveal = {
  render: () => html`
    <div style="padding-top: 200px;">
      <glass-card reveal center>
        <h3>Reveal Animation</h3>
        <p>スクロールすると表示されるアニメーション付きカードです。</p>
      </glass-card>
    </div>
  `,
};

export const MultipleCards = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 600px;">
      <glass-card>
        <h3>Card 1</h3>
        <p>シンプルなカードです。</p>
      </glass-card>
      <glass-card center>
        <h3>Card 2</h3>
        <p>中央揃えカードです。</p>
      </glass-card>
      <glass-card>
        <h3>Card 3</h3>
        <p>もう一つのカードです。</p>
      </glass-card>
    </div>
  `,
};
