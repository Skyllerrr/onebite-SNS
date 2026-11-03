import { useProfileData } from "@/hooks/queries/use-profile-data";
import { useSession } from "@/store/session";
import Fallback from "../fallback";
import Loader from "../loader";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import defaultAvatar from '@/assets/default-avatar.png'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { toast } from "sonner"

type Image = {file: File, previewUrl: string}

export default function ProfileEditorModal() {

  // 사용자의 정보 불러오기
  const session = useSession()
  // 사용자의 프로필 데이터 불러오기
  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchProfilePending
  } = useProfileData(session?.user.id)

  // 모달이 열고 닫히는 store 가져오기
  const store = useProfileEditorModal()
  const {
    isOpen,
    actions: { close },
  } = store

  // 프로필 수정을 위한 mutation 가져오기
  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUpdateProfile({
      onSuccess: () => {
        close()
      },
      onError: (error) => {
        toast.error("프로필 수정에 실패했습니다."), {
          position: "top-center"
        }
      }
    })

  // 프로필 모달에서 각각의 사용자의 입력들을 보관하는 3개의 state
  const [avatarImage, setAvatarImage] = useState<Image | null>(null)
  const [nickname, setNickname] = useState()
  const [bio, setBio] = useState("")

  // 프로필 모달의 Input 태그를 참조할 수 있는 레퍼런스 객체
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 메모리 누수 방지 ("모달이 닫혔을 때"도 새로운 이미지가 선택될 때, 기존의 이미지는 메모리로 부터 제거)
  useEffect(() => {
    if (!isOpen) {
      if (avatarImage) URL.revokeObjectURL(avatarImage.previewUrl)
    }
  
  }, [isOpen])
  
  // 프로필 데이터들을 초기화 (모달이 열리고, 프로필 수정의 데이터 변경이 있을 시)
  // 닉네임은 기존의 닉네임이 화면에 표출되고, 소개글 역시 기존에 소개글이 표출된다.
  // 이미지 파일만 null값인 이유는
  // 새롭게 설정된 이미지 파일만이 보관이 되기 때문에, 모달이 처음 열렸을 때에는 null값으로 초기화
  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.nickname)
      setBio(profile.bio)
      setAvatarImage(null)
    }
  }, [profile, isOpen])

  // 수정하기 버튼을 눌렀을 때의 동작
  const handleUpdateClick = () => {
    // 닉네임 변경란에 아무것도 없을 때는 그냥 return
    if (nickname.trim() === "") return
    // 수정 내용 (나의 프로필을 수정하기 위해 session 데이터를 불러옴)
    // session! - session 객체는 반드시 있을 거라고 단언하기 
    // (이유 : 사용자의 데이터가 없을 경우에는 로그인이 되지 않았고, 
    // 그럼 프로필 수정 모달도 열리지 않기 때문에 있을 것 이라고 단언하기)
    updateProfile({
      userId: session!.user.id,
      nickname,
      bio,
      avatarImageFile: avatarImage?.file
    })
  }

  // 사용자가 선택한 이미지가 프로필 이미지로 변경되도록 만들기
  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일(이미지)이 없다면 리턴 반환(함수 종료)
    // 그렇지 않다면 즉, 선택된 파일이 있다면 첫 번째로 선택된 파일(이미지)로 저장
    if (!e.target.files) return
    const file = e.target.files[0]

    // 메모리 누수 방지 (새로운 이미지가 선택될 때, 기존의 이미지는 메모리로 부터 제거)
    if (avatarImage) {
      URL.revokeObjectURL(avatarImage.previewUrl)
    }
    
    // 선택된 이미지를 state에 보관
    setAvatarImage({
      file,
      previewUrl: URL.createObjectURL(file)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        {fetchProfileError && <Fallback />}
        {isFetchProfilePending && <Loader />}
        {!fetchProfileError && !isFetchProfilePending && (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">프로필 이미지</div>
              <input
                disabled={isUpdateProfilePending}
                onChange={handleSelectImage}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <img
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click()
                }}
                src={avatarImage?.previewUrl || profile.avatar_url || defaultAvatar}
                className="h-20 w-20 cursor-pointer rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">닉네임</div>
              <Input
                disabled={isUpdateProfilePending}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">소개</div>
              <Input
                disabled={isUpdateProfilePending}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <Button
              disabled={isUpdateProfilePending}
              onClick={handleUpdateClick}
              className="cursor-pointer"
            >
              수정하기
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
