'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Toc } from 'pliny/mdx-plugins'

type PostTableOfContentsProps = {
  toc?: Toc
}

export default function PostTableOfContents({ toc = [] }: PostTableOfContentsProps) {
  const headings = useMemo(() => toc.filter((item) => item.depth === 2), [toc])
  const [activeId, setActiveId] = useState(() => headings[0]?.url.slice(1) || '')

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((element): element is HTMLElement => Boolean(element))

    if (elements.length === 0) return

    const updateActiveHeading = () => {
      const current = elements.reduce((active, element) => {
        return element.getBoundingClientRect().top <= 160 ? element : active
      }, elements[0])

      setActiveId(current.id)
    }

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="post-toc" aria-label="文章目录">
      <nav>
        <p className="post-toc-title">文章目录</p>
        <ol className="post-toc-list">
          {headings.map((heading) => {
            const id = heading.url.slice(1)

            return (
              <li key={heading.url}>
                <a
                  href={heading.url}
                  className={activeId === id ? 'is-active' : undefined}
                  aria-current={activeId === id ? 'location' : undefined}
                  onClick={(event) => {
                    const target = document.getElementById(id)
                    if (!target) return

                    event.preventDefault()
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    window.history.replaceState(null, '', heading.url)
                    setActiveId(id)
                  }}
                >
                  {heading.value}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </aside>
  )
}
