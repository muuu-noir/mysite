import { html } from "lit";

export default {
  title: "Components/SiteButton",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["more", "cta"],
      description: "ボタンのスタイル: more（テキストリンク風） / cta（アクションボタン）",
    },
    label: {
      control: "text",
      description: "ボタンのラベルテキスト",
    },
    href: {
      control: "text",
      description: "リンク先URL",
    },
  },
  args: {
    type: "more",
    label: "もっと見る",
    href: "#",
  },
};

const Template = ({ type, label, href }) => html`
  <site-button href=${href} type=${type}>${label}</site-button>
`;

export const More = {
  render: Template,
  args: {
    type: "more",
    label: "もっと見る",
  },
};

export const CTA = {
  render: Template,
  args: {
    type: "cta",
    label: "作品を見る",
  },
};

export const AllVariants = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
      <div>
        <p style="margin-bottom: 0.5rem; font-weight: 600;">type="more"</p>
        <site-button href="#" type="more">もっと見る</site-button>
      </div>
      <div>
        <p style="margin-bottom: 0.5rem; font-weight: 600;">type="cta"</p>
        <site-button href="#" type="cta">お問い合わせ</site-button>
      </div>
      <div>
        <p style="margin-bottom: 0.5rem; font-weight: 600;">type="cta" (English)</p>
        <site-button href="#" type="cta">View Project</site-button>
      </div>
    </div>
  `,
};
