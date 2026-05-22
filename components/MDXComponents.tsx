import { Children, isValidElement } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

function getImageAlt(children: ReactNode): string | null {
  let alt: string | null = null

  Children.forEach(children, (child) => {
    if (alt || !isValidElement(child)) return

    const props = child.props as { alt?: unknown; children?: ReactNode }

    if (typeof props.alt === 'string' && props.alt.trim()) {
      alt = props.alt.trim()
      return
    }

    if (props.children) {
      alt = getImageAlt(props.children)
    }
  })

  return alt
}

function hasFigcaption(children: ReactNode): boolean {
  let hasCaption = false

  Children.forEach(children, (child) => {
    if (hasCaption || !isValidElement(child)) return

    if (child.type === 'figcaption') {
      hasCaption = true
      return
    }

    const props = child.props as { children?: ReactNode }
    if (props.children) {
      hasCaption = hasFigcaption(props.children)
    }
  })

  return hasCaption
}

function Figure({ children, ...props }: HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
  const caption = getImageAlt(children)
  const shouldShowCaption =
    typeof caption === 'string' && caption.startsWith('强化学习笔记配图') && !hasFigcaption(children)

  return (
    <figure {...props}>
      {children}
      {shouldShowCaption ? (
        <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  figure: Figure,
  BlogNewsletterForm,
}
