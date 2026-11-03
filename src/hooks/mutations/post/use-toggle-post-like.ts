import { QUERY_KEYS } from './../../../lib/constants';
import type { Post, UseMutationCallback } from './../../../types';
import { togglePostLike } from '@/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useTogglePostLike(callbacks?:UseMutationCallback) {
  
  // 좋아요 결과 반영하기 (낙관적 업데이트) - [실시간으로 좋아요 요청으로 카운트 및 하트가 활성화 되고 비활성화 되는 것을 확인하기 위함]
  // 현재 포스트 아이템의 캐시 데이터가 이전에 발생한 조회 요청으로 인해서 덮어씌워지지 않도록 
  // 방지하기 위해 조회 요청을 취소 시키는 작업
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({
        queryKey : QUERY_KEYS.post.byId(postId)
      })

      // 캐시 데이터를 "백업" 느낌으로 따로 저장 (좋아요 요청이 실패할 경우)
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId)
      )

      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(postId), (post) => {
          if (!post) throw new Error("포스트가 존재하지 않습니다.")
          return {
            ...post,
            isLiked: !post.isLiked,
            like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1
          }
        })
      
      return {
        prevPost,
      }
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
    },
    onError: (error, _, context) => {
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost
        )
      }
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
