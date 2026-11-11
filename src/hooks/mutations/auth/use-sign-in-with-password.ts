import type { UseMutationCallback } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { signInWithPassword } from '@/api/auth';

// 이러한 커스텀 훅에는 데이터를 처리하는 기능이나 로깅 등의 기능만 코딩
// types.ts파일에 만든 UseMutationCallback이라는 이름으로 타입들을 정의하고 이렇게 콜백함수로 가져와도 된다.
export function useSignInWithPassword(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: signInWithPassword,
    onError: (error) => {
      console.error(error)

      if(callbacks?.onError) callbacks.onError(error)
    },
  })
}

