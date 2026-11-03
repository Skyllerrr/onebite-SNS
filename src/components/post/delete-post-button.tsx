import { useDeletePost } from "@/hooks/mutations/post/use-delete-post"
import { useOpenAlertModal } from "@/store/alert-modal"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useNavigate } from 'react-router'

export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal()
  const navigate = useNavigate()

  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    // 포스트 디테일 페이지에서 포스트가 삭제될 때, 인덱스 페이지(메인 페이지로) 
    // 리디렉션(되돌아) 되도록 설정
    onSuccess: () => {
      const pathname = window.location.pathname
      if (pathname.startsWith(`/post/${id}`)) {
        navigate('/', { replace: true })
      }
    },
    onError: (error) => {
      toast.error("포스트 삭제에 실패했습니다", {
        position: "top-center"
      })
    }
  })

  const handleDeleteClick = () => {
    openAlertModal({
      title: "포스트 삭제",
      description: "삭제된 포스트는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      onPositive: () => {
        // 포스트 삭제 요청 
        // 1. 포스트 삭제 요청을 보내는 비동기 함수 필요 - api / post.ts의 deletePost()라는 함수
        // 2. deletePost()함수가 보내는 과정에서 삭제 요청을 관리하는 mutation 필요 - hooks/mutations/post/use-delete-post.ts
        deletePost(id)
      }
    })
  }

  return (
    <Button
      disabled={isDeletePostPending}
      onClick={handleDeleteClick}
      className="cursor-pointer"
      variant={"ghost"}
    >
      삭제
    </Button>
  )
}
