// 비동기 함수 (인증 관련)
import supabase from "@/lib/supabase"
import { Provider } from 'react';

// 사용자 로그아웃 비동기 함수
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  // 기존에는 throw error로 예외상황을 던지지만,
  // 여기서는 어떻게든 로그아웃만 시키면 되기 때문에,
  // supabase서버와는 관계없이 로컬스토리지에 보관된 엑세스 토큰들을 아예 다 날려버리도록 설정해준다.
  if (error) {
    await supabase.auth.signOut({
      scope: "local"
    })
  }
}

// 회원가입 비동기 함수
export async function signUp({
  email,
  password
}: {
  email: string
  password: string
}) { 
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) throw error
  return data
}



// 로그인 비동기 함수
export async function signInWithPassword({
  email,
  password
}: {
    email: string
    password: string
  }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}



// 소셜 로그인 비동기 함수 (Github) 
// Provider - 인증이 필요한 부분들을 매개변수로 전달 (여기선 깃헙)
export async function signInWithOAuth(provider: Provider) {
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider,
  })

  if (error) throw error
  return data
}



// 인증 메일 요청 비동기 함수
// redirectTo = 한입 로그의 비밀번호 재설정 페이지 주소
export async function requestPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/reset-password`,
  })

  if (error) throw error
  return data
}



// 비밀번호 재설정  비동기 함수
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password
  })

  if (error) throw error
  return data
}
