import { getRandomNickname } from './../lib/utils';
import supabase from '@/lib/supabase';
// 프로필 관련 모든 비동기 함수

// 특정 유저의 프로필을 불러오는 비동기 함수
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single()
  
  if (error) throw error
  return data
}



// 프로필을 생성하는 비동기 함수
export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from('profile')
    .insert({
    id: userId,
    nickname: getRandomNickname()
    })
    .select()
    .single()

  if (error) throw error
  return data
}
