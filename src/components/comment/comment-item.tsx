import { Link } from "react-router";
import defaultAvatar from "@/assets/default-avatar.png";
import type { NestedComment } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "./comment-editor";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { toast } from 'sonner'
import { useOpenAlertModal } from "@/store/alert-modal";

export default function CommentItem(props: NestedComment) {

  // 유저 정보의 데이터 가져오기
  const session = useSession()
  
  // 정말로 삭제할껀지 확인하는 모달
  const openAlertModal = useOpenAlertModal()

  // 삭제 관련 mutation
  const { mutate: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
      onError: (error) => {
        toast.error("댓글 삭제에 실패했습니다.", {
          position: "top-center"
        })
      }
    })

  // 사용자가 댓글을 수정중인지 여부를 저장하는 state
  const [isEditing, setIsEditing] = useState(false)

  // 사용자가 대댓글을 선택했는지 여부를 저장하는 state
  const [isReply, setIsReply] = useState(false)

  // 댓글 수정 state를 토글할 수 있는 함수
  // 현재 state값을 토글하도록 만듦
  const toggleIsEditing = () => {
    setIsEditing(!isEditing)
  }

  // 대댓글 작성 state를 토글할 수 있는 함수
  const toggleIsReply = () => {
    setIsReply(!isReply)
  }

  // 댓글 삭제 클릭 함수
  const handleDeleteClick = () => {
    openAlertModal({
      title: "댓글 삭제",
      description: "삭제된 댓글은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
      onPositive: () => {
        deleteComment(props.id)
      }
    })
  }


  // 댓글의 작성자가 현재 "나" 인지 확인
  const isMine = session?.user.id === props.author_id

  // 댓글인지 대댓글인지 구분하기 (ui 구분을 위해)
  // 아래는 댓글일 때
  const isRootComment = props.parentComment === undefined

  // 대대댓글에 태그 표시 
  // (대대댓글과 부모 댓글과 대대댓글의 루트 댓글이 다를 시 true)
  const isOverTwoLevels = props.parent_comment_id !== props.root_comment_id

  return (
    <div className={`flex flex-col gap-8  border-b pb-5 ${isRootComment ? "border-b" : "ml-6"}`}>
      <div className="flex items-start gap-4">
        <Link to={"#"}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={props.author.avatar_url || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">{props.author.nickname}</div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commentId={props.id}
              initialContent={props.content}
              onClose={toggleIsEditing}
            />
          ) : (
              // nbsp; - 띄어쓰기
              <div>
                {isOverTwoLevels && (
                  <span className="font-bold text-blue-500">
                    @{props.parentComment?.author.nickname}&nbsp;
                  </span>
                )}
                {props.content}
              </div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                onClick={toggleIsReply}
                className="cursor-pointer hover:underline"
              >
                댓글
              </div>
              <div className="bg-border h-[13px] w-[2px]"></div>
              <div>{formatTimeAgo(props.created_at)}</div>
            </div>
            <div className="flex items-center gap-2">
              {isMine && (
                <>
                  <div
                    onClick={toggleIsEditing}
                    className="cursor-pointer hover:underline"
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-[2px]"></div>
                  <div
                    onClick={handleDeleteClick}
                    className="cursor-pointer hover:underline"
                  >
                    삭제
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReply && (
        <CommentEditor
          type={"REPLY"}
          postId={props.post_id}
          parentCommentId={props.id}
          rootCommentId={props.root_comment_id || props.id}
          onClose={toggleIsReply}
        />
      )}
      {props.children.map(comment => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
