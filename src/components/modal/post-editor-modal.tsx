import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCreatePost } from '@/hooks/mutations/post/use-create-post'
import { useUpdatePost } from '@/hooks/mutations/post/use-update-post'
import { useOpenAlertModal } from '@/store/alert-modal'
import { usePostEditorModal } from '@/store/post-editor-modal'
import { useSession } from '@/store/session'
import { ImageIcon, XIcon } from 'lucide-react'
import { useRef, useState, useEffect, ChangeEvent } from 'react'
import { toast } from "sonner"
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'

type Image = {
  file: File,
  previewUrl: string
}

export default function PostEditorModal() {
  const session = useSession()

  // zustand의 store를 이용하여 만든 액션 함수를 가져와서
  // 모달을 열고 닫을 수 있도록 만듦
  const postEditorModal = usePostEditorModal()

  // AlertModal을 열도록 하는 액션 함수 생성
  const openAlertModal = useOpenAlertModal()

  // 포스트 생성 훅 (포스트 생성("저장" 버튼 클릭)에 성공을 하게되면 close() 함수 실행)
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      postEditorModal.actions.close()
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다", {
        position: "top-center"
      })
    }
  })

  const { mutate : updatePost, isPending : isUpdatePostPending } = useUpdatePost({
    onSuccess: () => {
      postEditorModal.actions.close()
    },
    onError: (error) => {
      toast.error("포스트 수정에 실패했습니다", {
        position: "top-center"
      })
    }
  })

  // 모달안에 내용을 길게 입력할 때, 스크롤형태로 내려가지 않고,
  // 자동으로 늘어나게끔(모달 내용 칸이 늘어나도록) 만들어주기 위함으로 모달 안에 들어간 내용들을 state로 저장
  const [content, setContent] = useState("")
  const [images, setImages] = useState<Image[]>([])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  // 모달안에 내용을 길게 입력할 때, 스크롤형태로 내려가지 않고,
  // 자동으로 늘어나게끔(모달 내용 칸이 늘어나도록) 만들어주기 위함
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = 
        textareaRef.current.scrollHeight + "px"
    }
  }, [content])

  // 모달을 열었을 때, 포커싱이 모달안의 content로 갈 수 있게끔 만듦
  // revokeObjectURL(image.previewUrl) = 이미지의 메모리를 제거 (모달을 닫힐 때마다, 현재 images state에 보관된 모든 이미지 들의 메모리를 제거시켜줌)
  // setContent("") - 내용을 입력하다가 도중에 모달을 나간 뒤에 다시 키면 내용이 초기화 될 수 있게끔 만듦
  // setImages([]) - 추가 된 이미지에서 도중에 모달을 나간 뒤에 다시 키면 추가 된 이미지들이 초기화 될 수 있게끔 만듦
  useEffect(() => {
    if (!postEditorModal.isOpen) {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl)
      })
    return
    }
    
    if (postEditorModal.type === "CREATE") {
      setContent("")
      setImages([])
    } else {
      setContent(postEditorModal.content)
      setImages(postEditorModal.imageUrls)
    }
    textareaRef.current?.focus()
    
  }, [postEditorModal.isOpen])


  // 모달을 닫는 이벤트 핸들러 함수
  // 모달을 닫기 전, 사용자가 컨텐츠를 입력하다가 혹은 이미지를 추가시켜놓은 상태에 실수로 바깥을 누르거나 닫기 버튼을 눌렀을 때
  // 닫히지 않고 닫을꺼냐고 물어보는 모달을 추가로 열 수 있도록 만듦
  const handleCloseModal = () => {
    if (content !== "" || images.length !== 0) {
      // AlertModal
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다",
        description: "이 화면에서 나가면 작성중이던 내용이 사라집니다",
        onPositive: () => {
          postEditorModal.actions.close()
        },
      })
      return
    }
    postEditorModal.actions.close()
  }

  // 이미지 추가 버튼[저장 버튼] 클릭 이벤트 (포스트 생성 시의 저장 버튼과 포스트 수정 시의 저장 버튼에 따른 기능)
  // (+ 포스트를 업로드 하는 기능의 함수 추가)
  const handleSavePostClick = () => {
    if (content.trim() === "") return
    if (!postEditorModal.isOpen) return

    if (postEditorModal.type === "CREATE") {
      createPost({
        content,
        images: images.map((image) => image.file),
        userId: session!.user.id
      })
    } else {
      if(content === postEditorModal.content) return
      updatePost({
        id: postEditorModal.postId,
        content: content
      })
    }
  }

  // 위에 useState로 만든 setImages라는 이름의 Images state에 보관하는 함수
  const handleSelectImages = (e:ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      files.forEach((file) => {
        setImages((prev) => [
          ...prev,
          { file, previewUrl: URL.createObjectURL(file) },
        ])
      })
    }
    
    // 한번 선택된 이미지는 연속해서 올리지 못하도록 초기화 (향후에 자유로운 파일 선택을 위함)
    e.target.value = ""
  }

  // 이미지 X 버튼 클릭 시, 삭제
  // setImages라는 함수를 통해서 현재 handleDeleteImage 함수에 매개변수로 전달되는 image만 state를 통해 filter 메소드를 통해 정상적으로 제거가 됨
  // revokeObjectURL(image.previewUrl) = 이미지의 메모리를 제거 (모달안에 선택된 이미지를 삭제할때마다, 현재 images state에 보관된 모든 이미지들의 메모리를 제거시켜줌)
  const handleDeleteImage = (image:Image) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.previewUrl !== image.previewUrl)
    )

    URL.revokeObjectURL(image.previewUrl)
  }

  const isPending = isCreatePostPending || isUpdatePostPending

  return (
    <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
    <DialogContent className="max-h-[90vh]">
      <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          disabled={isPending}
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-125 min-h-25 focus:outline-none"
          placeholder="무슨 일이 있었나요?"
        />
        <input
          onChange={handleSelectImages}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple className="hidden"
        />

        {postEditorModal.isOpen && postEditorModal.type === "EDIT" &&
        <Carousel>
          <CarouselContent>
            {postEditorModal.imageUrls?.map((url) => <CarouselItem className="basis-2/5" key={url}>
              <div className="relative">
                <img
                  src={url}
                  className="h-full w-full rounded-sm object-cover"
                />
              </div>
            </CarouselItem>)}
          </CarouselContent>
        </Carousel>}

        {images.length > 0 && <Carousel>
          <CarouselContent>
            {images.map((image) => <CarouselItem className="basis-2/5" key={image.previewUrl}>
              <div className="relative">
                <img
                  src={image.previewUrl}
                  className="h-full w-full rounded-sm object-cover"
                />
                <div
                  onClick={() => handleDeleteImage(image)}
                  className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1"
                >
                  <XIcon className="h-4 w-4 text-white"/>
                </div>
              </div>
            </CarouselItem>)}
          </CarouselContent>
        </Carousel>}

        {
          postEditorModal.isOpen && postEditorModal.type === "CREATE" && (
          <Button
            onClick={() => {
              fileInputRef.current?.click()
              }}
            disabled={isPending}
            variant={"outline"}
            className="cursor=pointer"
          >
          <ImageIcon/>
            이미지 추가
          </Button>
          )
        }
      
        <Button
          disabled={isPending}
          onClick={handleSavePostClick}
          className="cursor=pointer">
          저장
        </Button>
    </DialogContent>
    </Dialog>
  )
}
