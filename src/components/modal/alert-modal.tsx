import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useAlertModal } from "@/store/alert-modal";

export default function AlertModal() {

  // alert-modal 컴포넌트의 openAlertModal() 컴포넌트를 통해서
  // 업데이트 해준 store의 값이 실제로 여기있는 AlertModal() 컴포넌트에 까지 반영이 되도록 설정

  // 모달이 열려있지 않을 때, 아무 변화가 없으니 null
  const store = useAlertModal()
  if (!store.isOpen) return null
  
  // 모달이 열려있을 때, 취소 버튼을 누를 시 변화
  const handleCancleClick = () => {
    if (store.onNegative) store.onNegative()
    store.actions.close()
  }

  // 모달이 닫혀있을 때, 확인 버튼을 누를 시 변화
  const handleActionClick = () => {
    if (store.onPositive) store.onPositive()
    store.actions.close()
  }

  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{store.title}</AlertDialogTitle>
          <AlertDialogDescription>{store.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancleClick}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleActionClick}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
