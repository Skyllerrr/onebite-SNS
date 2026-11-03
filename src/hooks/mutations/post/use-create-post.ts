import { QUERY_KEYS } from './../../../lib/constants';
import type { UseMutationCallback } from './../../../types';
import { createPost, createPostWithImages } from '@/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePost(callbacks?: UseMutationCallback) {
  
  // 캐싱 설정하기 (캐시 조작)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      
      // 캐싱 설정하기 (캐시 조작)
      // 방법 1. 캐시를 아예 초기화
      // 방법 2. 캐시 데이터에 완성된 포스트만 추가
      // 방법 3. 낙관적 업데이트 방식(onMutate)

      // 방법 1번 선택 (캐시를 아예 초기화)
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      })
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
