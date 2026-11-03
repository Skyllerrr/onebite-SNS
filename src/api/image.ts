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

// 이미지 삭제 함수 (삭제 버튼 클릭 시 사용)
// 특정된 모든 이미지 파일들을 제거하는 비동기 함수
export async function deleteImagesInPath(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path)
  
  // 현재 유저가 기존의 아바타 이미지를 등록해둔게 없다면 
  // 삭제 요청을 보내지 않도록 예외처리
  if (!files || files.length === 0) {
    return;
  }
  
  if (fetchFilesError) throw fetchFilesError
  
  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`))
      
  if (removeError) throw removeError
}
