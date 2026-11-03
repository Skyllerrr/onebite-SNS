import supabase from '@/lib/supabase';

// 특정 포스트에 모든 댓글들을 불러오는(즉, 댓글을 조회하는) 비동기 함수
// .select() - 사용자의 프로필 정보를 포함하여 가져와함 (아바타, 닉네임 등등)
// .eq() - 특정 포스트의 댓글만 불러오도록
// .order() - 댓글 정렬기준을 생성된 시간(created_at)을 기준으로 (ascending - 오름차순 : true)오름차순으로 가져옴 (오래된 순으로)
export async function fetchComments(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id (*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  
  if (error) throw error
  return data
}


// 댓글 작성을 요청하는 비동기 함수
// (+ parentCommentId - 대댓글)
// (+ rootCommentId - 무한 중첩 댓글)
export async function createComment({
  postId,
  content,
  parentCommentId,
  rootCommentId
}: {
  postId: number,
    content: string,
    parentCommentId?: number,
    rootCommentId?: number
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      post_id: postId,
      content: content,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}


// 댓글 수정을 요청하는 비동기 함수
export async function updateComment({
  id,
  content
}: {
    id: number,
    content: string
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({
      content
  })
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data
}


// 댓글 삭제를 요청하는 비동기 함수
export async function deleteComment(id: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data
}
