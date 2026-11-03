import { create } from "zustand";
import { combine, devtools } from 'zustand/middleware'

type CreateMode = {
  isOpen: true
  type: "CREATE"
}

type EditMode = {
  isOpen: true
  type: "EDIT",
  postId: number,
  content: string,
  imageUrls: string[] | null
}

type OpenState = CreateMode | EditMode

type CloseState = {
  isOpen: false
}

type State = CloseState | OpenState

const initialState = {
  isOpen: false,
} as State

// 모달의 상태를 보관하는 스토어
// 기존 - open(), close() 액션 함수
// 변경 - 새로운 포스트를 추가할 때 열기위한 모달 - openCreate() 액션 함수
// 기존의 포스트를 수정할 때 열기위한 모달 - openEdit() 액션 함수

// Omit<EditMode, "isOpen"> - EditMode State안에 있는 내용들 중에 isOpen, type을 제외한다 라는 뜻
// 이유 - ...param으로 모든 속성들을 가져왔는데 그 앞에 isOpen, type이 중복으로 정의되어있어서 이를 방지하기 위함 
const usePostEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => {
          set({ isOpen: true, type: "CREATE" })
        },
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "EDIT" , ...param })
        },
        close: () => {
          set({ isOpen: false })
        }
      }
    })),
    {
      name: "postEditorModalStore"
    }
  ),
)


// 커스텀 훅을 만든 이유 - 이러한 modal 데이터들을 다른 컴포넌트에서 가져다 쓰기 위함
export const useOpenCreatePostModal = () => {
  const openCreate = usePostEditorModalStore(
    (store) => store.actions.openCreate
  )
  return openCreate
}

export const useOpenEditPostModal = () => {
  const openEdit = usePostEditorModalStore(
    (store) => store.actions.openEdit
  )
  return openEdit
}

export const usePostEditorModal = () => {
  const store = usePostEditorModalStore()
  return store as typeof store & State
}
