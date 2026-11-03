// 프로필, 포스트, 댓글에 관한 부분들을 다른곳에서도 공용으로 사용할 수 있도록 키값으로 저장
export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile', 'list"],
    byId: (userId: string) => ["profile", "byId", userId]
  },

  // list = 기존의 모든 사용자들의 리스트
  // userList = 사용자가 선택한 특정 유저의 리스트
  post: {
    all: ['post'],
    list: ['post', 'list'],
    userList: (userId:string) => ["post", "userList", userId],
    byId: (postId: number) => ["post", "byId", postId]
  },
  comment: {
    all: ['comment'],
    post: (postId: number) => ["comment", "post", postId]
  }
}

// 이미지 업로드에 관한 uploads를 다른곳에서도 공용으로 사용할 수 있도록 변수로 저장
export const BUCKET_NAME = "uploads"
