import Fallback from "../fallback"
import Loader from "../loader"
import { useProfileData } from "@/hooks/queries/use-profile-data"
import dafaultAvatar from "@/assets/default-avatar.png"
import { useSession } from "@/store/session"
import EditProfileButton from "./edit-profile-button"

export default function ProfileInfo({ userId }: { userId : string }) {
  
  // 현재 사용자의 세션 데이터를 불러오기
  const session = useSession()

  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchingProfilePending
  } = useProfileData(userId)
  
  if (fetchProfileError) return <Fallback />
  if(isFetchingProfilePending) return <Loader/>
  
  // 현재 프로필 정보가 나의 프로필 정보인지 확인
  const isMine = session?.user.id === userId

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <img
        src={profile.avatar_url || dafaultAvatar}
        className="h-30 w-30 rounded-full object-cover"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">{profile.nickname}</div>
        <div className="text-muted-foreground">{profile.bio}</div>
      </div>
      {isMine && <EditProfileButton/>}
    </div>
  )
}
