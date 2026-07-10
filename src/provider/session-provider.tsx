import GlobalLoader from '@/components/global-loader'
import { useProfileData } from '@/hooks/queries/use-profile-data'
import supabase from '@/lib/supabase'
import { useIsSessionLoaded, useSession, useSetSession } from '@/store/session'
import { useEffect, type ReactNode } from 'react'

// SessionProvider()라는 컴포넌트를 생성하여 children 속성을 사용해서 App 컴포넌트와 연결을 시킴
// (기존에는 App 컴포넌트에서 이 코드를 사용했었는데 
// 너무 복잡해서 session - provider라는 이름의 파일에 SessionProvider()라는 컴포넌트에 세션을 관리하는 모든 로직이 들어있는 따로 저장하는 과정이다.)

// 코드 설명
// useEffect()훅으로 한번만 실행하게끔 만듦 
// (없었으면 App 컴포넌트가 리렌더링 될때마다 onAuthStateChange() 이벤트가 실행되서 불상사가 생김)

// 사용자가 로그인하게 되면, session 데이터가 변화함으로써 supabase의 클라이언트인 onAuthStateChange 이벤트 핸들러가 실행이 됨
// 화살표 함수에 의해, 현재 업데이트 된 session이 매개변수로 전달이 되고
// 이 매개변수는 setSession() 메서드의 인수로 전달이 됨
// 결론적으로는 업데이트된 session 데이터가 zustand에도 잘 보관이 됨
export default function SessionProvider({children,}: {children: ReactNode}) {
  const session = useSession()
  const setSession = useSetSession()
  const isSessionLoaded = useIsSessionLoaded()

  // 사용자가 로그인을 성공해서 session 데이터가 더이상 null값이 아니게 되면, 
  // 밑의 useProfileData의 인수로 전달되고 있는 user의 Id도 null값이 아니기 때문에
  // 결과적으로, use-profile-data 파일의 훅인 useProfileData()에 queryFn이 실행이 되어서 프로필 정보를 불러오게 된다.
  const {
    data: profile,
    isLoading: isProfileLoading,
    isPending
  } = useProfileData(session?.user.id)

    useEffect(( ) => {
      supabase.auth.onAuthStateChange((event, session) => { 
        setSession(session)
      })
    }, [])
  
  if (!isSessionLoaded) return <GlobalLoader />
  if (isProfileLoading) return <GlobalLoader />

  return children
}
