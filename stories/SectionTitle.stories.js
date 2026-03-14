import { html } from "lit";

export default {
  title: "Components/SectionTitle",
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "セクションの見出しテキスト",
    },
    center: {
      control: "boolean",
      description: "中央揃えにするか",
    },
    reveal: {
      control: "boolean",
      description: "スクロールアニメーションを有効にするか",
    },
  },
  args: {
    title: "WORKS",
    center: false,
    reveal: false,
  },
};

const Template = ({ title, center, reveal }) => html`
  <section-title
    title=${title}
    ?center=${center}
    ?reveal=${reveal}
  ></section-title>
`;

export const Default = {
  render: Template,
};

export const Centered = {
  render: Template,
  args: {
    title: "ABOUT",
    center: true,
  },
};

export const WithReveal = {
  render: Template,
  args: {
    title: "GALLERY",
    center: true,
    reveal: true,
  },
};

export const Various = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <section-title title="WORKS"></section-title>
      <section-title title="NEWS" center></section-title>
      <section-title title="ABOUT"></section-title>
      <section-title title="GALLERY" center></section-title>
      <section-title title="CONTACT"></section-title>
    </div>
  `,
};
