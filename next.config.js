const { readdirSync, readFileSync } = require('node:fs')
const { join } = require('node:path')
const matter = require('gray-matter')
const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const { withContentlayer } = require('next-contentlayer2')
const topologyLearning = require('./lib/learningSeries/topology-optimization.json')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Keep CSP aligned with the blog's current assets: giscus comments, analytics,
// self-hosted fonts (public/fonts), static audio files, and optional external images.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app zz.bdstatic.com push.zhanzhang.baidu.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' https: blob: data:;
  connect-src *;
  font-src 'self';
  frame-src 'self' giscus.app;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

function validatePostRecords() {
  const blogDir = join(__dirname, 'data', 'blog')
  const missing = []
  for (const file of readdirSync(blogDir, { recursive: true })) {
    if (!file.endsWith('.mdx')) continue
    const { data } = matter(readFileSync(join(blogDir, file), 'utf8'))
    if (data.draft === true) continue
    const { location, weather } = data.recordedAt ?? {}
    if (![location, weather].every((value) => typeof value === 'string' && value.trim())) {
      missing.push(file)
    }
  }
  if (missing.length) {
    throw new Error(
      `正式发布的文章必须填写 recordedAt.location 和 recordedAt.weather：${missing.join('、')}`
    )
  }
}

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) validatePostRecords()
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    trailingSlash: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    turbopack: {
      root: process.cwd(),
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.scdn.co',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    async redirects() {
      if (output === 'export') {
        return []
      }

      return [
        ...topologyLearning.topics.map((topic) => ({
          source: topic.legacyHref,
          destination: topologyLearning.core.href + '/#' + topic.anchor,
          permanent: false,
        })),
        {
          source: '/blog',
          destination: '/articles',
          permanent: true,
        },
        {
          source: '/blog/page/1',
          destination: '/articles',
          permanent: true,
        },
        {
          source: '/blog/:slug*',
          destination: '/articles/:slug*',
          permanent: true,
        },
        {
          source: '/prompts',
          destination: '/content/prompts',
          permanent: true,
        },
      ]
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
