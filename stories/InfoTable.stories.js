import { html } from "lit";

const newsData = [
  { date: "2025.03.01", text: "ポートフォリオサイトをリニューアルしました", link: "", isNew: true },
  { date: "2025.02.15", text: "新しいプロジェクトを公開しました", link: "#" },
  { date: "2025.01.20", text: "ブログ記事を更新しました", link: "#" },
  { date: "2024.12.10", text: "年末のご挨拶", link: "" },
];

const timelineData = [
  { date: "2024.04", text: "フロントエンドエンジニアとして勤務開始" },
  { date: "2023.03", text: "大学卒業" },
  { date: "2022.06", text: "インターンシップ参加（Web開発）" },
  { date: "2021.09", text: "プログラミング学習開始" },
];

export default {
  title: "Components/InfoTable",
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "テーブルに表示するデータ配列（JSON）。各項目は { date, text, link?, isNew? }",
    },
  },
  args: {
    data: newsData,
  },
};

const Template = ({ data }) => html`
  <info-table data=${JSON.stringify(data)}></info-table>
`;

export const News = {
  render: Template,
  args: {
    data: newsData,
  },
};

export const Timeline = {
  render: Template,
  args: {
    data: timelineData,
  },
};

export const WithLinks = {
  render: Template,
  args: {
    data: [
      { date: "2025.03.01", text: "新機能リリース", link: "#feature", isNew: true },
      { date: "2025.02.20", text: "バグ修正アップデート", link: "#bugfix" },
      { date: "2025.02.10", text: "ドキュメント更新", link: "#docs" },
    ],
  },
};

export const SingleItem = {
  render: Template,
  args: {
    data: [
      { date: "2025.03.15", text: "お知らせが1件だけの場合の表示", isNew: true },
    ],
  },
};
