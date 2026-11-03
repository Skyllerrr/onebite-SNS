import type { Theme } from './../types';
import { create } from "zustand";
import { combine, devtools, persist } from 'zustand/middleware'

type State = {
  theme: Theme
}

const initialState: State = {
  theme: "light"
}

// 새로고침 시, 테마 유지를 하기 위한 store에 보관
const useThemeStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setTheme: (theme: Theme) => {
            const htmlTag = document.documentElement
            htmlTag.classList.remove('dark', 'light')

            // system 테마는 사용자의 데스크탑의 설정값에 따라 테마가 다름
            // 크게 중요하지 X
            if (theme === 'system') {
              const isDarkTheme = window.matchMedia('(prefers-color-scheme)'
              ).matches

              htmlTag.classList.add(isDarkTheme ? "dark" : "light")
            } else {
              htmlTag.classList.add(theme)
            }

            set({ theme })
          }
        }
      })),
      {
        name: "ThemeStore",
        partialize: (store) => ({
          theme: store.theme
        })
      }),
    { name: "ThemeStore" }
  )
)

// 새로고침 시, 테마 유지를 위한 커스텀 훅 2개
export const useTheme = () => {
  const theme = useThemeStore((store) => store.theme)
  return theme
}

export const useSetTheme = () => {
  const setTheme = useThemeStore((store) => store.actions.setTheme)
  return setTheme
}
