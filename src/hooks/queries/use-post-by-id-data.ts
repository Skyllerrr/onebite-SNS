import { useSession } from './../../store/session';
import { QUERY_KEYS } from './../../lib/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById } from '@/api/post';

export function usePostByIdData({
  postId,
  type
}: {
  postId: number
  type: "FEED" | "DETAIL"
  }) {
  
  const session = useSession()
  
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () =>
      fetchPostById({
        postId,
        userId: session!.user.id
      }),

    // "FEED" - 메인 피드 화면 : queryFn이 실행되지 않고, 캐시데이터만 설정
    // "DETAIL" - 디테일 화면 : queryFn이 실행됨으로 실제로 서버로부터 데이터를 불러오도록 설정
    enabled: type === "FEED" ? false : true
  })
}
