import { useProfileData } from '@/hooks/queries/use-profile-data';
import { useSession } from './../../../store/session';
import { QUERY_KEYS } from './../../../lib/constants';
import { createComment } from '@/api/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment, UseMutationCallback } from './../../../types';

// 작성된 댓글 데이터를 추가하는 요청을 관리할 mutation 필요
export function useCreateComment(callbacks?: UseMutationCallback) {

  // 댓글 추가 시 - 캐시 수정 기능 (화면에 실시간 반영하기 위함)
  const queryClient = useQueryClient()

  // 나의 프로필 데이터 불러오기
  const session = useSession()
  const {data: profile} = useProfileData(session?.user.id)

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()

      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(newComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관 되어있지 않습니다.")

          if (!profile)
            throw new Error("사용자의 프로필 정보를 찾을 수 없습니다.")

          return [...comments, {...newComment, author: profile}]
        }
      )
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
