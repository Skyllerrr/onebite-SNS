import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { useSetTheme, useTheme } from '@/store/theme'
import type { Theme } from '@/types'
import { PopoverClose } from '@radix-ui/react-popover'
import { SunIcon, CheckIcon } from 'lucide-react'

// 다크, 라이트 모드 타입 정의 (types.ts에도 저장)
const THEMES: Theme[] = ['system', 'dark', 'light']

export default function ThemeButton() {

  // 새로고침 시, 테마 유지 (theme.ts에서 가져옴)
  const currentTheme = useTheme()
  const setTheme = useSetTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <div className="hover:bg-muted cursor-pointer rounded-full p-2">
          <SunIcon/>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-35 p-0'>
        {THEMES.map((theme) => (
          <PopoverClose key={`theme-button-${theme}`} asChild>
            <div
              onClick={() => setTheme(theme)}
              className='hover:bg-muted cursor-pointer flex justify-between p-3'
            >
              {theme}
              {currentTheme === theme && <CheckIcon className="h-4 w-4" />}
            </div>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  )
}
