import { Link, Outlet } from 'react-router'
import logo from '@/assets/logo.png'
import defaultAvatar from '@/assets/default-avatar.png'
import { SunIcon } from 'lucide-react'

export default function GlobalLayout() {
  return (
    <div className="min-h-[100vh] flex flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between">
          <Link to={"/"} className="flex items-center gap-2">
            <img
              className="h-5"
              src={logo}
              alt="한입 로그의 로고, 메세지 말풍선을 형상화한 모양이다" />
            <div className="fold-bold">한입 로그</div>
          </Link>
          <div className="flex items-center gap-5">
            <div className="hover:bg-muted cursor-pointer rounded-full p-2">
              <SunIcon/>
            </div>
            <img className="h-6" src={defaultAvatar} alt="" />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-175 w-full m-auto px-4 py-6 border-x">
        <Outlet/>
      </main>
      <footer className="border-t py-10 text-muted-foreground text-center">
        @winterlood
      </footer>
    </div>
  )
}