import CommentItem from "@/components/comment/comment-item";
import { useCommentsData } from "@/hooks/queries/use-comments-data";
import type { NestedComment } from "@/types";
import Fallback from "../fallback";
import Loader from "../loader";

// 대댓글을 남길 시, comment 부모요소의 자식요소로 들어가게끔 중첩 요소로 만들어줌
// 즉, 화면에서 대댓글 버튼을 눌렀을 때, 댓글 바로 밑에 대댓글을 남길 Editor가 띄워져야함
function toNestedComments(comments: Comment[]) : NestedComment[] {
  const result: NestedComment[] = []

  // 대댓글이 아닐 시, 대댓글 일 시
  comments.forEach((comment) => {
    if (!comment.root_comment_id) {
      result.push({ ...comment, children: [] })
    } else {
      const rootCommentIndex = result.findIndex(
        (item) => item.id === comment.root_comment_id
      )

      const parentComment = comments.find(
        (item) => item.id === comment.parent_comment_id
      )

      if (rootCommentIndex === -1) return
      if (!parentComment) return

      result[rootCommentIndex].children.push({
        ...comment,
        children: [],
        parentComment
      })
    }
  })

  return result
}

export default function CommentList({ postId }: { postId: number }) {

  // 특정 프로필의 댓글들을 불러오기 (api에 만든 비동기 함수로부터 -> hooks의 queries의 comment로 부터)
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchCommentPending
  } = useCommentsData(postId)

  if (fetchCommentsError) return <Fallback />
  if (isFetchCommentPending) return <Loader />
  
  const nestedComments = toNestedComments(comments)

  return (
    <div className="flex flex-col gap-5">
      {nestedComments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
