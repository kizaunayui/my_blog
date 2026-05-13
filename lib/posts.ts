import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: number;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => getPostBySlug(fileName.replace(/\.md$/, "")))
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  const fullPath = path.join(postsDirectory, `${safeSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { metadata, content } = parseFrontmatter(fileContents);

  return {
    slug: safeSlug,
    title: metadata.title ?? safeSlug,
    date: metadata.date ?? new Date().toISOString(),
    excerpt: metadata.excerpt ?? "",
    tags: metadata.tags ?? [],
    content,
    readingTime: calculateReadingTime(content)
  };
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.trim().split(/\r?\n/);
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      html.push(`<ul>${listItems.join("")}</ul>`);
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      html.push(`<h3>${renderInline(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      html.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${renderInline(line.slice(2))}</blockquote>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(`<li>${renderInline(line.slice(2))}</li>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}

type PostMetadata = {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
};

function parseFrontmatter(fileContents: string): {
  metadata: PostMetadata;
  content: string;
} {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!match) {
    return {
      metadata: {},
      content: fileContents
    };
  }

  const metadata: PostMetadata = {};
  const frontmatter = match[1];

  for (const line of frontmatter.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim() as keyof PostMetadata;
    const value = line.slice(separator + 1).trim();

    if (key === "tags") {
      metadata.tags = value
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }

    if (key === "title" || key === "date" || key === "excerpt") {
      metadata[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return {
    metadata,
    content: match[2]
  };
}

function calculateReadingTime(content: string): number {
  const words = content.replace(/[^\w\u4e00-\u9fa5]/g, "").length;
  return Math.max(1, Math.ceil(words / 450));
}

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
