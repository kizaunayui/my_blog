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

内容中心包含三个二级栏目：

- `/content/prompts`：Prompt 模板库，使用 `data/promptsData.ts` 和 `PromptLibrary` 样式。
- `/content/works`：作品展示，读取 `data/blog/*.mdx` 中 `category: '作品展示'` 的文章，样式接近文章列表。
- `/content/research`：项目研究，读取 `data/blog/*.mdx` 中 `category: '项目研究'` 的文章，样式接近文章列表。

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
