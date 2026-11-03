import { QUERY_KEYS } from './../../../lib/constants';
import { updateComment } from '@/api/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment, UseMutationCallback } from './../../../types';

// 작성된 댓글 데이터를 수정하는 요청을 관리할 mutation 필요
export function useUpdateComment(callbacks?: UseMutationCallback) {

  // 댓글 수정 시 - 캐시 수정 기능 (화면에 실시간 반영하기 위함)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()

      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(updatedComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관되어 있지 않습니다.")
          
          return comments.map((comment) => {
            if (comment.id === updatedComment.id)
              return { ...comment, ...updatedComment }
            return comment
          })
        }
      )
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
