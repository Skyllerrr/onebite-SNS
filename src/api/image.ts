import { BUCKET_NAME } from './../lib/constants';
import supabase from '@/lib/supabase'

// 이미지 업로드 비동기 함수
// 즉, 이미지를 업로드하고 해당 이미지의 주소를 추출해서 반환하는 함수
export async function uploadImage({
  file,
  filePath
}: {
  file: File
  filePath: string
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)
  
  if (error) throw error

  // 현재 업로드한 이미지의 주소(여기서는 임의의 프로퍼티인 publicUrl)를 반환하도록 만듦
  // 기존에서는 return data로 마무리
  const { data: { publicUrl }
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrl
}
