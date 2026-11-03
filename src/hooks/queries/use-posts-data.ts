import { QUERY_KEYS } from './../../lib/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/post';

export function usePostsData() {
  return useQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: () => fetchPosts(),
  })
}
