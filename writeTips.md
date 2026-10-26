**記事の書き方（次回から）**

1. `blog/posts/` に Markdown ファイルを作る

```
---
title: 記事タイトル
date: 2026-05-01
category: design / process / automation など
description: 一行説明
---

本文をMarkdownで書く
```

2. `npm run build` を実行

→ HTML・OG画像・`index.json`・`sitemap.xml` が全部自動生成されます。
