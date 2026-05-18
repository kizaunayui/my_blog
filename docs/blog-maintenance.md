# 博客内容维护说明

## 新增一篇文章

文章统一放在 `data/blog/` 目录，文件名建议使用英文短横线，例如：

```text
data/blog/my-new-note.mdx
```

基础 frontmatter：

```yaml
---
title: '文章标题'
date: '2026-05-18'
category: '课程复习笔记'
tags: ['课程笔记', 'PDF']
draft: false
summary: '这里写文章摘要。'
---
```

`category` 建议使用以下四个值之一：

- `Prompt 模板库`
- `课程复习笔记`
- `作品展示`
- `项目研究`

文章发布后会出现在 `/articles`，并按 `category` 自动进入对应内容中心栏目。

## 给课程笔记绑定 PDF

PDF 文件放在：

```text
public/files/notes/
```

例如：

```text
public/files/notes/electrical-machinery-review.pdf
```

在对应 MDX 文章 frontmatter 中增加：

```yaml
pdf: '/files/notes/electrical-machinery-review.pdf'
```

文章详情页会自动显示 PDF 下载按钮和桌面端在线预览，不需要在组件里写死 PDF 链接。

## 当前核心路由

- `/` 首页
- `/articles` 全部文章
- `/articles/[slug]` 文章详情
- `/content` 内容中心
- `/content/prompts` Prompt 模板库
- `/content/notes` 课程复习笔记
- `/content/works` 作品展示
- `/content/research` 项目研究
- `/about` 关于我
