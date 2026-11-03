import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { toast } from "sonner"
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";

// 댓글을 입력하는 기능과 댓글을 수정하는 기능, 대댓글을 다는 기능을 Props로 관리
type CreateMode = {
  type: "CREATE"
  postId: number
}

type EditMode = { 
  type: "EDIT"
  commentId: number
  initialContent: string
  onClose: () => void
}

// parentCommentId - 대댓글
// rootCommentId - 무한 중첩 댓글
type ReplyMode = {
  type: "REPLY",
  postId: number
  parentCommentId: number
  rootCommentId: number
  onClose: () => void
}

// Props에 CreateMode와 EditMode, ReplyMode 셋 다 정의
type Props = CreateMode | EditMode | ReplyMode

// pages의 post-detail-page.tsx에서 
// CommentEditor에 props를 정의하고 부모컴포넌트로부터 가져옴
export default function CommentEditor(props: Props) {

  const { mutate: updateComment, isPending: isUpdateCommentPending } = useUpdateComment({
    onSuccess: () => {
      (props as EditMode).onClose()
    },
    onError: () => {
      toast.error("댓글 수정에 실패했습니다.", {
        position: "top-center"
      })
    }
  })

  // 사용자가 작성한 댓글들을 content state에 보관
  const [content, setContent] = useState("")

  // 수정을 위한 렌더링 상태일 때, initialContent로 초기화 시키기
  useEffect(() => {
    if (props.type === "EDIT") {
      setContent(props.initialContent)
    }
  }, [])

  // 댓글 작성 mutation 가져오기 (대댓글 작성 포함)
  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("")
        if(props.type === "REPLY") props.onClose()
      },
      onError: () => {
        toast.error("댓글 추가에 실패했습니다.", {
          position: "top-center"
        })
      }
    })

  // 댓글 작성 버튼 클릭
  const handleSubmitClick = () => {
    // 아무것도 적지 않으면 다시 리턴
    if (content.trim() === "") return

    // 댓글 작성 시, 대댓글 작성 시, 댓글 수정 시 변화
    if (props.type == "CREATE") {
      createComment({
        postId: props.postId,
        content
      })
    } else if (props.type === "REPLY") {
      createComment({
        postId: props.postId,
        content,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId
      })
    } else {
      updateComment({
        id: props.commentId,
        content
      })
    }
  }

  // 로딩 상태
  const isPending = isCreateCommentPending || isUpdateCommentPending

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="flex justify-end">
        {props.type === "EDIT" ||
          (props.type === "REPLY" && (
            <Button
              disabled={isPending}
              variant={'outline'}
              onClick={() => props.onClose()}
            >
              취소
            </Button>
          ))}
        <Button
          disabled={isPending}
          onClick={handleSubmitClick}
        >
          작성
        </Button>
      </div>
    </div>
  );
}
