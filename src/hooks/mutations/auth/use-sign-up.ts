import type { UseMutationCallback } from '@/types';
import { signUp } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"

export function useSignUp(callbacks? : UseMutationCallback) {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
