import { useSession } from '@/store/session';
import { QUERY_KEYS } from './../../lib/constants';
import { useQuery } from '@tanstack/react-query'
import { createProfile, fetchProfile } from '@/api/profile';
import type { PostgrestError } from '@supabase/supabase-js'

// fetchProfile을 관리하는 쿼리
export function useProfileData(userId?: string) {

  // 나의 프로필을 불러올때 만, 프로필이 존재하지 않을 시 프로필을 생성해주게끔(아래의 createProfile 함수) 만듦
  // (다른 사람의 프로필이 없을 때, 만들어버리면 이상한 상황이 되기 때문에, 내 프로필이 없을 때만 생성하기 위함)
  const session = useSession()
  const isMine = userId === session?.user.id

  return useQuery({
    // userId는 null값이 아닐거라고 단언해주기 
    // (어차피 아래에서 userId가 없을 경우에는 enabled로 아무일도 일어나지 않게끔 만들기 때문에 상관없음)
    queryKey: QUERY_KEYS.profile.byId(userId!),

    // (userId는 null값이 아닐거라고 단언해주기)
    // (어차피 아래에서 userId가 없을 경우에는 enabled로 아무일도 일어나지 않게끔 만들기 때문에 상관없음)
    // userId에 따라 프로필을 불러오게 만듦
    queryFn: async () => {
      try {
        const profile = await fetchProfile(userId!)
        return profile
      }
      catch (error) {
        if (isMine && (error as PostgrestError).code === 'PGRST116') {
          return await createProfile(userId!)
        }
        throw error
      }
    },

    // userId가 없을 경우에는 아무일도 일어나지 않게끔 만듦
    enabled: !!userId
  })
}
