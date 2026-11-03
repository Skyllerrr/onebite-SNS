import { useOpenCreatePostModal } from '@/store/post-editor-modal'
import { PlusCircleIcon } from 'lucide-react'

export default function CreatePostButton() {
  // zustand의 store를 이용하여 만든 액션 함수(useOpenCreatePostModal()를 가져와서
  // 모달을 열고 닫을 수 있도록 만듦

  // 새로운 포스트를 생성하기 위한 오픈 모달
  const openCreatePostModal = useOpenCreatePostModal()

  return (
    <div
      onClick={openCreatePostModal}
      className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div>나누고 싶은 이야기가 있나요?</div>
        <PlusCircleIcon className="h-5 w-5" />
      </div>
    </div>
  ) 
}
