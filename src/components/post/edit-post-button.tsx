import { useOpenEditPostModal } from "@/store/post-editor-modal"
import type { PostEntity } from "@/types"
import { Button } from "../ui/button"

export default function EditPostButton(props: PostEntity) {
  // zustand의 store를 이용하여 만든 액션 함수(useOpenCreatePostModal()를 가져와서
  // 모달을 열고 닫을 수 있도록 만듦

  // 기존의 포스트를 수정하기 위한 오픈 모달
  const openEditPostModal = useOpenEditPostModal()

  const handleButtonClick = () => {
    openEditPostModal({
      postId: props.id,
      content: props.content,
      imageUrls: props.image_urls
    })
  }

  return (
    <Button onClick={handleButtonClick} className="cursor-pointer" variant={"ghost"}>
      수정
    </Button>
  )
}
