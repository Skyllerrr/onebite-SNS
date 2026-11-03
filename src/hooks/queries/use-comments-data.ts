import { QUERY_KEYS } from './../../lib/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchComments } from '@/api/comment';

// 특정 포스트의 댓글을 조회하는 비동기 함수를 관리하는 쿼리
export function useCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.post(postId),
    queryFn: () => fetchComments(postId)
  })
}
