import { create } from "zustand";
import { combine, devtools } from 'zustand/middleware'

const initialState = {
  isOpen: false,
}

// 모달의 상태를 보관하는 스토어
const usePostEditorModalStore = create(
  devtools(combine(initialState, (set) => ({
    actions: {
      open: () => {
        set({ isOpen: true })
      },
      close: () => {
        set({ isOpen: false })
      }
    }
  })), { name: "postEditorModalStore" }),
)


// 해당 스토어를 이용하는 2개의 커스텀 훅
// 커스텀 훅을 만든 이유 - 이러한 modal 데이터들을 다른 컴포넌트에서 가져다 쓰기 위함
export const useOpenPostEditorModal = () => {
  const open = usePostEditorModalStore((store) => store.actions.open)
  return open
}

export const usePostEditorModal = () => {
  const {
    isOpen,
    actions: { open, close },
  } = usePostEditorModalStore()
  return {
    isOpen,
    open,
    close
  }
}
