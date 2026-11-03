import { useOpenProfileEditorModal } from "@/store/profile-editor-modal"
import { Button } from "../ui/button"

export default function EditProfileButton() {

  // 모달을 열기 위한 액션함수 가져오기
  const openProfileEditorModal = useOpenProfileEditorModal()

  return (
    <Button
      onClick={openProfileEditorModal}
      variant={'secondary'}
      className="cursor-pointer"
    >
      프로필 수정
    </Button>
  )
}
