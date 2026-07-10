import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCreatePost } from '@/hooks/mutations/post/use-create-post'
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
  // 모달안에 내용을 길게 입력할 때, 스크롤형태로 내려가지 않고,
  // 자동으로 늘어나게끔(모달 내용 칸이 늘어나도록) 만들어주기 위함으로 모달 안에 들어간 내용들을 state로 저장
  const [content, setContent] = useState("")
  const [images, setImages] = useState<Image[]>([])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const session = useSession()

  // zustand의 store를 이용하여 만든 액션 함수를 가져와서
  // 모달을 열고 닫을 수 있도록 만듦
  const { isOpen, close } = usePostEditorModal()

  // 포스트 생성 훅 (포스트 생성("저장" 버튼 클릭)에 성공을 하게되면 close() 함수 실행)
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      close()
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다", {
        position: "top-center"
      })
    }
  })

  const handleCloseModal = () => {
    close()
  }

  // 이미지 추가 버튼 클릭 이벤트 (+ 포스트를 업로드 하는 기능의 함수 추가)
  const handleCreatePostClick = () => {
    if (content.trim() === "") return
    createPost({
      content,
      images: images.map((image) => image.file),
      userId: session!.user.id
    })
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
  const handleDeleteImage = (image:Image) => {
    setImages((prevImages) => prevImages.filter((item) => item.previewUrl !== image.previewUrl))
  }


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
  // setContent("") - 내용을 입력하다가 도중에 모달을 나간 뒤에 다시 키면 내용이 초기화 될 수 있게끔 만듦
  // setImages([]) - 추가 된 이미지에서 도중에 모달을 나간 뒤에 다시 키면 추가 된 이미지들이 초기화 될 수 있게끔 만듦
  useEffect(() => {
    if (!isOpen) return
    textareaRef.current?.focus()
    setContent("")
    setImages([])
  }, [isOpen])

  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
    <DialogContent className="max-h-[90vh]">
      <DialogTitle>포스트 작성</DialogTitle>
        <textarea
          disabled={isCreatePostPending}
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
        <Button
          onClick={() => {
            fileInputRef.current?.click()
          }}
          variant={"outline"}
          className="cursor=pointer"
        >
        <ImageIcon/>
        이미지 추가</Button>
        <Button
          disabled={isCreatePostPending}
          onClick={handleCreatePostClick}
          className="cursor=pointer">
          저장
        </Button>
    </DialogContent>
    </Dialog>
  )
}
