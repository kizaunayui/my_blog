#!/usr/bin/env node
/**
 * download-fonts.mjs — 自托管站点字体
 *
 * 从 Google Fonts 拉取 css2 描述与全部 woff2 切片(含 Noto Serif SC 的
 * unicode-range 中文切片),落盘到 public/fonts/,并重写 css/fonts.css
 * 为指向 /fonts/ 的本地 @font-face 声明。
 *
 * 用法:  node scripts/download-fonts.mjs
 * 要求:  Node >= 18(内置 fetch);能访问 fonts.googleapis.com 的网络
 *        (大陆网络若不通,可先设代理:HTTPS_PROXY=... node scripts/download-fonts.mjs)
 *
 * 运行完成后把 public/fonts/ 与 css/fonts.css 一起提交进仓库即可,
 * 线上不再有任何第三方字体请求。
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const FAMILIES = [
  'family=Cinzel:wght@300..800',
  'family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700',
  'family=Outfit:wght@200..800',
  'family=Inter:wght@300..700',
  // 中文衬线:变量字重 300..600,css2 会按 unicode-range 切成 ~110 个小片,
  // 浏览器只会下载页面实际用到的切片。
  'family=Noto+Serif+SC:wght@300..600',
]

const CSS2_URL = `https://fonts.googleapis.com/css2?${FAMILIES.join('&')}&display=swap`
// 现代 UA 才能拿到 woff2 + unicode-range 版本的 CSS
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FONT_DIR = path.join(ROOT, 'public', 'fonts')
const OUT_CSS = path.join(ROOT, 'css', 'fonts.css')
const CONCURRENCY = 8
const RETRIES = 3

async function fetchWithRetry(url, init, kind) {
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, init)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (err) {
      if (attempt === RETRIES) throw new Error(`下载失败 (${kind}): ${url} — ${err.message}`)
      await new Promise((r) => setTimeout(r, attempt * 800))
    }
  }
}

function localNameFor(url) {
  // gstatic 路径形如 /s/notoserifsc/v37/<hash>.woff2 → notoserifsc-<hash 前 12 位>.woff2
  const u = new URL(url)
  const parts = u.pathname.split('/').filter(Boolean)
  const family = parts[1] || 'font'
  const digest = createHash('sha1').update(u.pathname).digest('hex').slice(0, 12)
  return `${family}-${digest}.woff2`
}

async function main() {
  console.log('▸ 拉取字体描述 CSS …')
  const css = await (
    await fetchWithRetry(CSS2_URL, { headers: { 'User-Agent': UA } }, 'css')
  ).text()

  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1]))]
  if (urls.length === 0) throw new Error('没有在 CSS 里找到任何字体文件地址,Google Fonts 返回可能异常')
  console.log(`▸ 共 ${urls.length} 个字体切片,开始下载到 public/fonts/ …`)

  await mkdir(FONT_DIR, { recursive: true })

  let done = 0
  const mapping = new Map()
  const queue = [...urls]
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const url = queue.pop()
        const name = localNameFor(url)
        const buf = Buffer.from(
          await (await fetchWithRetry(url, { headers: { 'User-Agent': UA } }, 'woff2')).arrayBuffer()
        )
        await writeFile(path.join(FONT_DIR, name), buf)
        mapping.set(url, `/fonts/${name}`)
        done += 1
        if (done % 25 === 0 || done === urls.length) console.log(`  … ${done}/${urls.length}`)
      }
    })
  )

  let localCss = css
  for (const [remote, local] of mapping) localCss = localCss.split(remote).join(local)

  const banner = `/* 本文件由 scripts/download-fonts.mjs 自动生成 — 请勿手改。\n   生成命令: node scripts/download-fonts.mjs */\n\n`
  await writeFile(OUT_CSS, banner + localCss)

  const totalKB = Math.round(
    (await Promise.all(
      [...mapping.values()].map(async (p) =>
        (await import('node:fs/promises')).stat(path.join(ROOT, 'public', p.slice(1))).then((s) => s.size)
      )
    ).then((sizes) => sizes.reduce((a, b) => a + b, 0))) / 1024
  )
  console.log(`✔ 完成:${mapping.size} 个文件(约 ${totalKB} KB)→ public/fonts/`)
  console.log('✔ css/fonts.css 已重写为本地地址')
  console.log('  提交 public/fonts/ 与 css/fonts.css 后即可上线,无需其它改动。')
}

main().catch((err) => {
  console.error('✘ ' + err.message)
  process.exit(1)
})
