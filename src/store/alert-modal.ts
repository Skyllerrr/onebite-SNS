// AlertModal을 전역 상태로 관리
import { create } from "zustand";
import { combine, devtools } from 'zustand/middleware';

type OpenState = {
  isOpen: true
  title: string
  description: string
  onPositive?: () => void
  onNegative?: () => void
}

type CloseState = {
  isOpen: false
}

type State = CloseState | OpenState

const initialState = {
  isOpen: false
} as State

// Omit<??State, "??"> = TypeScript의 유틸리티 타입
// 어떤 State에서 굳이 전달할 필요가 없는 파라미터를 제외시킬 수 있음
const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
    actions: {
      open: (params: Omit<OpenState, "isOpen">) => {
        set({...params, isOpen: true})
      },
      close: () => {
        set({ isOpen: false })
      }
    }
    })),
    { name: "AlertModalStore" }
  ),
)


// 해당 스토어를 이용하는 2개의 커스텀 훅
// 커스텀 훅을 만든 이유 - 이러한 modal 데이터들을 다른 컴포넌트에서 가져다 쓰기 위함
export const useOpenAlertModal = () => {
  const open = useAlertModalStore((store) => store.actions.open)
  return open
}

export const useAlertModal = () => {
  const store = useAlertModalStore()
  return store as typeof store & State
}
