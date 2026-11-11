import type { UseMutationCallback } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { signInWithOAuth } from "@/api/auth";

export function useSignInWithOAuth(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: signInWithOAuth,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error)
    }
  })
}
