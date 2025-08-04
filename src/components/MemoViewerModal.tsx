'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'

// Dynamic import to avoid SSR issues
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

interface MemoViewerModalProps {
  isOpen: boolean
  memo: Memo | null
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
}

export default function MemoViewerModal({
  isOpen,
  memo,
  onClose,
  onEdit,
  onDelete,
}: MemoViewerModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const handleDelete = () => {
    if (memo && window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      onDelete(memo.id)
      onClose()
    }
  }

  const handleEdit = () => {
    if (memo) {
      onEdit(memo)
    }
  }

  if (!isOpen || !memo) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* 배경 클릭으로 모달 닫기 */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-label="Close modal"
      />
      
      {/* 모달 콘텐츠 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {memo.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(memo.category)}`}
              >
                {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                  memo.category}
              </span>
              <span className="text-sm text-gray-500">
                생성: {formatDate(memo.createdAt)}
              </span>
              {memo.updatedAt !== memo.createdAt && (
                <span className="text-sm text-gray-500">
                  수정: {formatDate(memo.updatedAt)}
                </span>
              )}
            </div>
          </div>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="prose max-w-none">
            <div data-color-mode="light">
              <MarkdownPreview
                source={memo.content}
                style={{
                  backgroundColor: 'transparent',
                  color: '#374151'
                }}
              />
            </div>
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">태그</h4>
              <div className="flex gap-2 flex-wrap">
                {memo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            편집
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}