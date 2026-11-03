import Fallback from "../fallback"
import Loader from "../loader"
import PostItem from "./post-item"
import { useInView } from 'react-intersection-observer'
import { useEffect } from "react"
import { useInfinitePostsData } from "@/hooks/queries/use-infinite-posts-data"

// index페이지에서의 포스트는 모든 사용자의 포스트가 화면에 나와야 하지만,
// 프로필 상세 페이지에서는 클릭한 해당 유저의 프로필 및 포스트만 나와야 하기 때문에
// 매개변수에 (선택적 프로퍼티를 포함 : authorId?)를 추가하여 
// index페이지에서는 전체 프로필, profileDetail페이지에서는 해당 프로필만 나오게끔 만들어주기 위함
export default function PostFeed({ authorId }: { authorId?:string }) {
  const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
    useInfinitePostsData({authorId})
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      // 데이터 추가
      // fetchNextPage() -> 다음 페이지를 불러올 수 있도록 queryFn을 재호출하는 기능)
      fetchNextPage()
    }
  }, [inView])
  
  if (error) return <Fallback />
  if (isPending) return <Loader />

  // isFetchingNextPage = 현재 다음 페이지를 불러오는 데이터가 있으면 true, 아니면 false
  return (
    <div className="flex flex-col gap-10">
      {data.pages.map((page) =>
        page.map((postId) => <PostItem key={postId} postId={postId} type={"FEED"} />)
      )}
      {isFetchingNextPage && <Loader/>}
      <div ref={ref}></div>
    </div>
  )
}
