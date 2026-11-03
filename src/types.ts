import { type Database } from "./database.types";

export type PostEntity = Database['public']['Tables']['post']['Row']
export type ProfileEntity = Database['public']['Tables']['profile']['Row']
export type CommentEntity = Database['public']['Tables']['comment']['Row']

export type Post = PostEntity & { author: ProfileEntity, isLiked: boolean }

// 댓글 작성자 정보를 포함하는 타입
export type Comment = CommentEntity & { author: ProfileEntity }

// 대댓글 타입 (화면에는 comment 부모 요소에 자식 요소로 들어가야함)
// 대댓글 버튼을 눌렀을 때, 댓글 바로 밑에 대댓글을 작성할 수 있도록 Editor가 띄워져야함
export type NestedComment = Comment & {
  parentComment?: Comment
  children: NestedComment[]
}

// Mutation 관련 타입 정리 
export type UseMutationCallback = {
  onSuccess?: () => void
  onError?: (error: Error) => void
  onMutate?: () => void
  onSettled?: () => void
}

// 다크, 라이트 모드 변환 타입 정리
export type Theme = "system" | "dark" | "light"
