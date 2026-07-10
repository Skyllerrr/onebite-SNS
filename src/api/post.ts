import type { PostEntity } from './../types';
import supabase from '@/lib/supabase';

// 포스트를 생성하는 비동기 함수
// .select().single() - 컨텐츠가 들어있는 모든 포스트들을 가져오는데 하나만 가져오게끔 만듦
export async function createPost(content: string) {
  const { data, error } = await supabase
    .from('post')
    .insert({
    content
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// 포스트 생성 시, 이미지를 업로드하기 위한 비동기 함수
export async function createPostWithImages({ 
  content,
  images,
  userId
}: {
  content: string
  images: File[]
  userId: string
}) {
  // 1. 새로운 포스트 생성 (맨 위에서 생성한 포스트 비동기 함수 가져오기)
  const post = await createPost(content)

  // 2. 이미지 업로드 전, 이미지가 없는 상황의 예외처리 (다음 포스트로 넘기기)
  if (images.length === 0) return post
  // 2. 이미지 업로드
  // fileExtension = 이미지의 확장자 이름 가져오기
  // (예시: abc.png는 split(".")으로 점을 없애고 pop()으로 맨뒤에 단어를 가져와서 png가 뽑힘)
  // 확장자가 없다면, webp 형태로 추출
  // fileName = 파일의 이름 (중복이 안되게끔 현재 시간을 밀리세컨즈 단위로 만든 후, 자바스크립트의 내장 메서드로 랜덤한 유니크 아이디로 생성하게끔 만듦)
  // filePath = 이미지 파일의 주소
  try {
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp"
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`
        const filePath = `${userId}/${post.id}/${fileName}`

        return uploadImage({
          file: image,
          filePath
        })
      })
    )
    // 3. 포스트 테이블 업데이트
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls
    })

    return updatedPost
  }
  catch(error) {
    await deletePost(post.id)
    throw error
  }
}


// PostEntity의 모든 프로퍼티들을 가져오지 않고, 
// Partial <> 를 사용하여 있을 수도 있고 없을 수도 있다는 선택적 프로퍼티로 반환해줌
// 이 함수가 최소한 어떤 포스트를 수정하는지는 알아야하기 때문에, id값은 전달이 되어야 한다

// supabase를 통해 post 테이블에서(from 메서드) post라는 매개변수를 업데이트(update 메서드) 하는데, 
// 어떠한 아이템을 업데이트(ep 메서드) 할꺼냐면, id가 현재 post 매개변수에 전달된 id와 일치하는 아이템을 업데이트 하도록 만듦
// .select().single() - 업데이트 된 아이템을 반환하도록 만듦
export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}



// 예외처리 (위에 try ~ catch문에 사용했음)
// 이미지 업로드 과정에서 혹은 포스트 테이블을 업데이트하는 과정에서 오류가 발생했을 시, 
// 처음에 포스트 생성 했던 것을 삭제하는 함수
// 즉, 2번이나 3번 과정에서 오류가 발생했을 시에 1번에서 만든 포스트를 삭제하는 함수이다.
// 처음부터 생성부터 없던 일로 취급한다고 생각하면 이해하기 쉬움
export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data
}
