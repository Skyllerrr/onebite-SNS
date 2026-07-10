// 프로필에 관한 부분들을 다른곳에서도 공용으로 사용할 수 있도록 변수로 저장
export const QUERY_KEYS = {
  profile: {
    all: ['profile'],
    list: ['profile', 'list'],
    byId: (userId: string) => ['profile', 'byId', userId]
  }
}

// 이미지 업로드에 관한 uploads를 다른곳에서도 공용으로 사용할 수 있도록 변수로 저장
export const BUCKET_NAME = "uploads"
