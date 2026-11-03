import { QUERY_KEYS } from './../../../lib/constants';
import { type Post, type UseMutationCallback } from './../../../types';
import { updatePost } from '@/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdatePost(callbacks?:UseMutationCallback) {
  
  // 캐싱 설정하기 (캐시 조작)
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      
      // 캐싱 설정하기 (캐시 조작)
      // onSuccess()로 데이터가 잘 수정될 시, 리프레쉬 없이 실시간으로 바로 수정이 되도록 만듦
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(updatedPost.id),
        (prevPost) => {
          if (!prevPost)
            throw new Error(
              `${updatedPost.id}에 해당하는 포스트를 캐시 데이터에서 찾을 수 없습니다.`,
            )
          
          return { ...prevPost, ...updatedPost }
        }
      )
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
