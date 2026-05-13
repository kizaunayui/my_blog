# Vercel Blog

一个基于 Next.js App Router 的轻量博客，适合直接部署到 Vercel。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 写文章

在 `content/posts` 目录新增 Markdown 文件：

```md
---
title: "文章标题"
date: "2026-05-13"
excerpt: "文章摘要"
tags: ["Next.js", "Vercel"]
---

正文内容。
```

文件名会成为文章 URL，例如 `hello-world.md` 对应 `/posts/hello-world`。

## 部署到 Vercel

1. 把这个目录推送到 GitHub。
2. 在 Vercel 新建项目并导入该仓库。
3. Framework Preset 选择 `Next.js`。
4. Build Command 使用 `npm run build`，Output Directory 保持默认。
5. 点击 Deploy。
