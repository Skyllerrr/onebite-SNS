import { QUERY_KEYS } from './../../../lib/constants';
import type { UseMutationCallback } from './../../../types';
import { deletePost } from '@/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImagesInPath } from '@/api/image';

export function useDeletePost(callbacks?:UseMutationCallback) {
  
  // 캐싱 설정하기 (캐시 조작)
  // onSuccess()로 데이터가 잘 삭제될 시, 리프레쉬 없이 실시간으로 바로 삭제가 되도록 만듦
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      
      // 이미지를 삭제하는 기능 
      // 위의 onSuccess()만으로는 데이터베이스에 저장되어있는 postItem은 삭제될지언정
      // storage에 보관되어있는 이미지들은 함께 삭제가 되지 않기 때문에
      // 이를 삭제하기 위해 즉, storage에 보관된 이미지들도 같이 삭제하기 위해 만드는 기능
      if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
        await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`)
      }

      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list
      })
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
