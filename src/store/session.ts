// Zustand의 store
import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { combine, devtools } from 'zustand/middleware'

type State = {
  isLoaded: boolean,
  session: Session | null
}

const initialState = {
  isLoaded : false,
  session: null
} as State


// Zustand의 devtools와 combine 적용
const useSessionStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSession: (session: Session | null) => {
          set({ session, isLoaded: true })
        }
      }
    })),{
      name: "sessionStore"
    }
  )
)


// 커스텀 훅을 만든 이유 - 이러한 session 데이터들을 다른 컴포넌트에서 가져다 쓰기 위함
// session 상태에 접근하는 커스텀 훅
export const useSession = () => {
  const session = useSessionStore((store) => store.session)
  return session
}

// isloaded 즉, 로딩 상태를 불러오는 커스텀 훅
export const useIsSessionLoaded = () => {
  const isSessionLoaded = useSessionStore((store) => store.isLoaded)
  return isSessionLoaded
}

// setSession() 이라는 액션 함수를 불러오는 커스텀 훅
export const useSetSession = () => {
  const setSession = useSessionStore((store) => store.actions.setSession)
  return setSession
}
