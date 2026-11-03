import { QUERY_KEYS } from './../../../lib/constants';
import type { ProfileEntity, UseMutationCallback } from './../../../types';
import { updateProfile } from '@/api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateProfile(callbacks?: UseMutationCallback) {
  
  // 캐시 설정으로 실시간으로 반영
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      if (callbacks?.onSuccess) callbacks.onSuccess()
      
      queryClient.setQueryData<ProfileEntity>(
        QUERY_KEYS.profile.byId(updatedProfile.id),
        updatedProfile
      )
    },
    onError: (error) => {
      if(callbacks?.onError) callbacks.onError(error)
    }
  })
}
