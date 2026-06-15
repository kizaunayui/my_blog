import type { ReactNode } from 'react'

type TableWrapperProps = {
  children: ReactNode
}

const TableWrapper = ({ children }: TableWrapperProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table>{children}</table>
    </div>
  )
}

export default TableWrapper
