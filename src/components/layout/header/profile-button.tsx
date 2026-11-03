import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { useProfileData } from "@/hooks/queries/use-profile-data"
import { useSession } from "@/store/session"
import { Link } from 'react-router'

import defaultAvatar from '@/assets/default-avatar.png'
import { signOut } from "@/api/auth"

export default function ProfileButton() {

  // 사용자의 정보를 가져오기
  const session = useSession()
  const { data: profile } = useProfileData(session?.user.id)


  if (!session) return null
  return <Popover>
    <PopoverTrigger>
      <img src={profile?.avatar_url || defaultAvatar}
          className="h-6 w-6 cursor-pointer rounded-full object-cover"
      />
    </PopoverTrigger>
    <PopoverContent className="flex flex-col w-40 p-0">
      <PopoverClose asChild>
        <Link to={`/profile/${session.user.id}`}>
          <div className="hover:bg-muted cursor-pointer px-4 py-3 text-sm">
            프로필
          </div>
        </Link>
      </PopoverClose>
      <PopoverClose asChild>
        <div
          onClick={signOut}
          className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
        >
          로그아웃
        </div>
      </PopoverClose>
    </PopoverContent>
  </Popover>
}
