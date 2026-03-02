import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (currentPage + delta >= totalPages - 1 && totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return totalPages === 1 ? [] : rangeWithDots
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-8'>
      {/* Results Info */}
      <div className='text-sm text-gray-600'>
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center gap-2'>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg border transition-colors
            ${currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-shop_dark_green'
            }
          `}
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        {/* Page Numbers */}
        <div className='flex items-center gap-1'>
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className='px-3 py-2 text-gray-500'>...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    px-3 py-2 rounded-lg border transition-colors font-medium
                    ${page === currentPage
                      ? 'bg-shop_dark_green text-white border-shop_dark_green'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-shop_dark_green'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg border transition-colors
            ${currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-shop_dark_green'
            }
          `}
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>
    </div>
  )
}

export default Pagination
