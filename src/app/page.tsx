'use client'

import { useState } from 'react'
import { useMemos } from '@/hooks/useMemos'
import { Memo, MemoFormData } from '@/types/memo'
import MemoList from '@/components/MemoList'
import MemoForm from '@/components/MemoForm'
import MemoViewerModal from '@/components/MemoViewerModal'

export default function Home() {
  const {
    memos,
    loading,
    searchQuery,
    selectedCategory,
    stats,
    createMemo,
    updateMemo,
    deleteMemo,
    searchMemos,
    filterByCategory,
  } = useMemos()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)

  const handleCreateMemo = (formData: MemoFormData) => {
    createMemo(formData)
    setIsFormOpen(false)
  }

  const handleUpdateMemo = (formData: MemoFormData) => {
    if (editingMemo) {
      updateMemo(editingMemo.id, formData)
      setEditingMemo(null)
    }
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo)
    setIsFormOpen(true)
    setSelectedMemo(null) // 뷰어 모달 닫기
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingMemo(null)
  }

  // 메모 선택 핸들러 (카드 클릭 시)
  const handleMemoSelect = (memo: Memo) => {
    setSelectedMemo(memo)
  }

  // 뷰어 모달 닫기
  const handleCloseViewer = () => {
    setSelectedMemo(null)
  }

  // 뷰어에서 편집 버튼 클릭
  const handleEditFromViewer = (memo: Memo) => {
    setSelectedMemo(null) // 뷰어 모달 닫기
    setEditingMemo(memo)
    setIsFormOpen(true)
  }

  // 뷰어에서 삭제 버튼 클릭
  const handleDeleteFromViewer = (id: string) => {
    deleteMemo(id)
    setSelectedMemo(null) // 뷰어 모달 닫기
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">📝 메모 앱</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                새 메모
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemoList
          memos={memos}
          loading={loading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={searchMemos}
          onCategoryChange={filterByCategory}
          onEditMemo={handleEditMemo}
          onDeleteMemo={deleteMemo}
          onMemoSelect={handleMemoSelect}
          stats={stats}
        />
      </main>

      {/* 메모 뷰어 모달 */}
      <MemoViewerModal
        isOpen={!!selectedMemo}
        memo={selectedMemo}
        onClose={handleCloseViewer}
        onEdit={handleEditFromViewer}
        onDelete={handleDeleteFromViewer}
      />

      {/* 모달 폼 */}
      <MemoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingMemo ? handleUpdateMemo : handleCreateMemo}
        editingMemo={editingMemo}
      />
    </div>
  )
}
