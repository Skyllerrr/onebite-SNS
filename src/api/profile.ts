import { deleteImagesInPath, uploadImage } from '@/api/image';
import { getRandomNickname } from './../lib/utils';
import supabase from '@/lib/supabase';
/* 프로필 관련 모든 비동기 함수 */

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



// 프로필 정보를 수정하는 비동기 함수
export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarImageFile
}: {
  userId: string
  nickname?: string
  bio?: string
  avatarImageFile?: string
}) {
  // 1. 기존 아바타 이미지 삭제
  if (avatarImageFile) {
    // avatar 폴더 안에 모든 이미지들을 제거
    await deleteImagesInPath(`${userId}/avatar`)
  }

  // 2. 변경할 새로운 아바타 이미지 업로드
  let newAvatarImageUrl;
  if (avatarImageFile) {
    
    // 파일 경로의 "확장자"만 추출 or 확장자가 없으면 webp 확장자로 추출
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp"
    // 폴더 경로를 명시하고, 현재 시간을 밀리세컨즈로 변환해주고 파일의 이름은 랜덤하게 설정, 마지막엔 파일 확장자를 명시
    const filePath = `${userId}/avatar/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`

    newAvatarImageUrl = await uploadImage({
      file: avatarImageFile,
      filePath
    })
  }

  // 3. 프로필 테이블 업데이트
  const { data, error } = await supabase.from("profile").update({
    nickname,
    bio,
    avatar_url : newAvatarImageUrl,
  })
    .eq("id", userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
