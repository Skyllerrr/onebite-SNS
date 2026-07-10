import PostEditorModal from "@/components/modal/post-editor-modal"
import type { ReactNode } from 'react'
import { createPortal } from "react-dom"

// createPortal - 특정 DOM 요소를 지정해서 컴포넌트를 해당 DOM 아래에 랜더링 하도록 만들 수 있음
// 쓰는 이유 : 이렇게 "모달"을 랜더링 할때는 최종 화면 가장 앞에 띄워줘야 하기때문에 계층 구조로 인하여 그대로 컴포넌트를 가져오게 되면
// 계층 하위에 있지말고 상위에 있도록 사용한다.
export default function ModalProvider({ children }: { children: ReactNode }) {
  return <>
    {createPortal(
      <PostEditorModal />,
      document.getElementById('modal-root')!,
    )}
    {children}
  </>
}
