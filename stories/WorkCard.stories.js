import { html } from "lit";

export default {
  title: "Components/WorkCard",
  tags: ["autodocs"],
  argTypes: {
    img: {
      control: "text",
      description: "サムネイル画像のパス",
    },
    title: {
      control: "text",
      description: "作品タイトル",
    },
    subtitle: {
      control: "text",
      description: "サブタイトル（技術スタックなど）",
    },
    href: {
      control: "text",
      description: "リンク先URL",
    },
    description: {
      control: "text",
      description: "作品の説明文",
    },
  },
  args: {
    img: "img/placeholder.png",
    title: "Sample Project",
    subtitle: "HTML / CSS / JavaScript",
    href: "#",
    description: "これはサンプルの作品カードです。実際のプロジェクトの説明がここに入ります。",
  },
};

const Template = ({ img, title, subtitle, href, description }) => html`
  <work-card
    img=${img}
    title=${title}
    subtitle=${subtitle}
    href=${href}
  >
    ${description}
  </work-card>
`;

export const Default = {
  render: Template,
};

export const WithImage = {
  render: Template,
  args: {
    img: "img/work-thumb-01.webp",
    title: "396 FOLIO",
    subtitle: "HTML / CSS / JavaScript / Web Components",
    href: "#",
    description: "ポートフォリオサイト。グラスモーフィズムとミニマルデザインを組み合わせたモダンなWebサイトです。",
  },
};

export const MultipleCards = {
  render: () => html`
    <div class="container" style="display: flex; flex-direction: column; gap: 2rem;">
      <work-card
        img="img/work-thumb-01.webp"
        title="Project Alpha"
        subtitle="React / TypeScript / Firebase"
        href="#"
      >
        フロントエンドとバックエンドを統合したフルスタックWebアプリケーション。
      </work-card>
      <work-card
        img="img/work-thumb-02.webp"
        title="Project Beta"
        subtitle="Python / Django / PostgreSQL"
        href="#"
      >
        データ分析ダッシュボード。リアルタイムでデータを可視化します。
      </work-card>
    </div>
  `,
};
