import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from 'react-router'
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password"
import gitHubLogo from '@/assets/github-mark.svg'
import { useSignInWithOAuth } from "@/hooks/mutations/auth/use-sign-in-with-oauth"
import { toast } from 'sonner'
import { generateErrorMessage } from "@/lib/error"

export default function SignInPage() {
  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")

  // 이러한 컴포넌트에는 UI와 사용자 상호작용 부분만 코딩
  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } = useSignInWithPassword({
    onError: (error) => {
      const message = generateErrorMessage(error)

      toast.error(message, {
        position: "top-center",
      })
      setPassword("")
    }
  })
  const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } = useSignInWithOAuth({
    onError: (error) => {
      const message = generateErrorMessage(error)

      toast.error(message, {
        position: "top-center",
      })
    }
  })
  
  const handleSignInWithPasswordClick = () => {
    if (email.trim() === "") return
    if (password.trim() === "") return

    signInWithPassword({
      email,
      password
    })
  }

  // github 인수를 signInWithOAuth() 함수로 호출
  const handleSignInWithGitHubClick = () => {
    signInWithOAuth('github')
  }

  // 로그인 시, 로그인이 진행되는 로딩 시간동안 로그인 버튼 비활성화(disabled)를 시키기 위함
  const isPending = isSignInWithPasswordPending || isSignInWithOAuthPending

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={isPending}
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="py-6"
          type="email"
          placeholder="example@abc.com" />
        <Input
          disabled={isPending}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="py-6"
          type="password"
          placeholder="password" />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          disabled={isPending}
          onClick={handleSignInWithPasswordClick}
          className="w-full"
        >
          로그인
        </Button>
        <Button
          disabled={isPending}
          onClick={handleSignInWithGitHubClick}
          className="w-full"
          variant={'outline'}
        >
          <img src={gitHubLogo} className="w-4 h-4" />
          GitHub 계정으로 로그인
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Link className="text-muted-foreground hover:underline" to={"/sign-up"}>
          계정이 없으시다면? 회원가입
        </Link>
        <Link className="text-muted-foreground hover:underline" to={"/forget-password"}>
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  )
}
