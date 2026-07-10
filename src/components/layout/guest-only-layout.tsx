import { useSession } from '@/store/session'
import { Navigate, Outlet } from 'react-router'

// session 데이터가 존재한다면, index페이지로 리디렉션 시켜줌
// 인증이 된 사람들만 보일 수 있는 화면으로 이동하게끔
// session 데이터가 존재하지 않을 때 (로그인 안됐을 시) -> 로그인, 회원가입, 비밀번호 잊어버릴때의 창
// session 데이터가 존재할 때 (로그인 됐을 시) -> 로그인 성공 시 출력되는 인덱스 페이지 리디렉션
export default function GuestOnluLayout() {
  const session = useSession()
  if (session) return <Navigate to={'/'} replace={true} />

  return <Outlet/>
}
