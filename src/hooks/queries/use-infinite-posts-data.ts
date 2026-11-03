import { useSession } from './../../store/session';
import { fetchPosts } from '@/api/post';
import { QUERY_KEYS } from './../../lib/constants';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query' 

// 피드를 불러올 때 마다 최대 5개의 포스트까지만 불러옴
const PAGE_SIZE = 5


// 1. 무한 스크롤 구현을 위한 useInfiniteQuery()는 queryFn이 페이지 단위로 데이터를 나눠서 구현해야함
// 2. index페이지에서의 포스트는 모든 사용자의 포스트가 화면에 나와야 하지만,
// 프로필 상세 페이지에서는 클릭한 해당 유저의 프로필 및 포스트만 나와야 하기 때문에
// 매개변수에 (선택적 프로퍼티를 포함 : authorId?)를 추가하여 
// index페이지에서는 전체 프로필, profileDetail페이지에서는 해당 프로필만 나오게끔 만들어주기 위함
export function useInfinitePostsData({ authorId }: { authorId?: string }) {

  // 캐싱 설정하기 (정규화)
  const queryClient = useQueryClient()

  const session = useSession()

  // queryKey에 authorId가 즉, 특정 유저의 아이디가 선택되지 않았다면 기존처럼 모든 포스트의 리스트들이 출력되면 되는데,
  // 그게 아니라면 즉, 특정 유저의 아이디가 선택된다면 그 유저의 포스트 리스트만 출력되어 화면에 나와야한다.
  return useInfiniteQuery({
    queryKey: !authorId
      ? QUERY_KEYS.post.list
      : QUERY_KEYS.post.userList(authorId),
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const posts = await fetchPosts({
        from,
        to,
        userId: session!.user.id,
        authorId
      })
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post)
      })
      return posts.map((post) => post.id)
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지에 도달하게 되면, 불러올 데이터는 더 이상 없다고 설정
      if (lastPage.length < PAGE_SIZE) return undefined
      return allPages.length
    },

    // 캐싱 설정하기 (무한 스크롤 캐시 최적화)
    // 자동으로 리패칭이 일어나지 않음 (캐시를 갑자기 한꺼번에 변화를 일으킬 걱정이 없음)
    staleTime: Infinity,
  })
}
