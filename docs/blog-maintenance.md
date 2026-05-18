# 博客内容维护说明

## 文章板块

文章板块保持原来的博客文章系统，不属于内容中心二级菜单。

新增普通文章时，继续在 `data/blog/` 目录创建 `.mdx` 文件：

```text
data/blog/my-new-article.mdx
```

基础 frontmatter：

```yaml
---
title: '文章标题'
date: '2026-05-18'
tags: ['标签']
draft: false
summary: '这里写文章摘要。'
---
```

普通文章会显示在 `/blog`，详情页路径为 `/blog/[slug]`。

## 内容中心

内容中心只包含四个二级栏目：

- `/content/prompts`：Prompt 模板库，使用原来的 `data/promptsData.ts` 和 `PromptLibrary` 样式。
- `/content/notes`：课程复习笔记，使用 `data/notesData.ts`，只按科目分类，样式接近 Prompt 模板库。
- `/content/works`：作品展示，读取 `data/blog/*.mdx` 中 `category: '作品展示'` 的文章，样式接近文章列表。
- `/content/research`：项目研究，读取 `data/blog/*.mdx` 中 `category: '项目研究'` 的文章，样式接近文章列表。

## 新增复习笔记

复习笔记不放进普通文章列表，维护在 `data/notesData.ts`：

```ts
{
  title: '电机学考前复习笔记',
  subject: '电机学',
  tags: ['课程笔记', 'PDF'],
  description: '整理电机学的核心概念、公式和题型。',
  updatedAt: '2026-05-18',
  pdf: '/files/notes/electrical-machinery-review.pdf',
  outline: ['核心概念', '重要公式', '易错点'],
}
```

PDF 文件放在：

```text
public/files/notes/
```

例如：

```text
public/files/notes/electrical-machinery-review.pdf
```

## 新增作品展示或项目研究

这两类内容使用 MDX，但只进入内容中心对应栏目。示例：

```yaml
---
title: '项目标题'
date: '2026-05-18'
category: '作品展示'
tags: ['项目展示']
draft: false
summary: '这里写摘要。'
---
```

项目研究则把 `category` 改为：

```yaml
category: '项目研究'
```
