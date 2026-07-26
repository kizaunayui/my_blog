import Link from '@/components/Link'

interface EditorialPaginationProps {
  currentPage: number
  totalPages: number
  prevHref?: string
  nextHref?: string
}

/**
 * 全站唯一的分页控件:居中胶囊 + 上下细线 + 中间页码计数。
 * 首页、归档页、标签页共用,保证同一功能只有一种形态。
 */
export default function EditorialPagination({
  currentPage,
  totalPages,
  prevHref,
  nextHref,
}: EditorialPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Pagination"
      className="editorial-pagination mx-auto mt-7 flex w-fit items-center gap-1 border-y border-[color:var(--hairline)] px-2 py-1 text-xs font-bold"
    >
      {prevHref ? (
        <Link href={prevHref} rel="prev" className="pagination-link rounded-full px-3.5 py-2">
          Prev · 上一页
        </Link>
      ) : (
        <span className="pagination-link is-disabled rounded-full px-3.5 py-2">Prev · 上一页</span>
      )}
      <span className="pagination-status min-w-[3.75rem] px-3 py-2 text-center">
        {currentPage} / {totalPages}
      </span>
      {nextHref ? (
        <Link href={nextHref} rel="next" className="pagination-link rounded-full px-3.5 py-2">
          Next · 下一页
        </Link>
      ) : (
        <span className="pagination-link is-disabled rounded-full px-3.5 py-2">Next · 下一页</span>
      )}
    </nav>
  )
}
