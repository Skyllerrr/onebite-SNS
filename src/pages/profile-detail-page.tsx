import PostFeed from '@/components/post/post-feed'
import ProfileInfo from '@/components/profile/profile-info'
import { Navigate, useParams } from 'react-router'
import { useEffect } from 'react' 

export default function ProfileDetailPage() {

  // 모든 url 파라미터 가져오기
  const params = useParams()
  
  // params의 userId값을 꺼내서 userId에 저장
  const userId = params.userId

  
  // 최하단의 특정한 유저 선택 -> 뒤로가기 -> 다시 특정한 유저 선택 시에
  // 스크롤 최상단으로 리프레쉬 되게끔 올려주는 기능
  useEffect(() => {
    window.scrollTo({
      top: 0
    })
  }, [])


  if (!userId) return <Navigate to={"/"} replace />

  return (
    <div className="flex flex-col gap-10">
      <ProfileInfo userId={userId} />
      <div className="border-b"></div>
      <PostFeed authorId={userId} />
    </div>
  )
}
